<template>
  <section>
    <h1 v-if="!user">Getting getting user information ...</h1>
    <h1 v-if="user">Hello {{user.name || user.profile.displayName}} !! 👋</h1>
    <v-btn @click="logout">Logout</v-btn>
    <clients></clients>
  </section>
</template>

<script>
import { METHODS } from "http";
import clients from "../components/clients";

const API_URL = `${process.env.VUE_APP_API_URL}/auth`;
export default {
  data: () => ({
    user: null
  }),
  mounted() {
    fetch(API_URL, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(result => {
        if (result.user) {
          this.user = result.user;
        } else {
          this.logout();
        }
      });
  },
  methods: {
    logout() {
      fetch(`${API_URL}/logout`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(result => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style>
</style>