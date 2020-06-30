<template lang="html">
  <section class="login">
    <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
               
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="submit" @keyup.native.enter="login">
                  <v-text-field
                  v-model="email"
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="email"
                  ></v-text-field>

                  <v-text-field
                  v-model="password"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    autocomplete="true"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary"  @click="login()">Login</v-btn>
                <v-btn color="primary" @click="loginGoogle()">Google Login</v-btn>
              </v-card-actions>
            </v-card>
  </section>

</template>

<script lang="ts">
import Vue from "vue";
const googleLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/google`;
const loginURL: string = `${process.env.VUE_APP_API_URL}/auth/login`;
const authCheckURL: string = `${process.env.VUE_APP_API_URL}`;
export default Vue.extend({
  name: "login",
  data: () => ({
    email: "",
    password: ""
  }),
  mounted() {
    fetch(authCheckURL, { method: "GET" , credentials:'include'})
      .then(response => response.json())
      .then(result => {
        if(result && result.authenticated){
          this.$router.push('/');
        }
      });
  },
  methods: {
    loginGoogle() {
      window.location.href = googleLoginURL;
    },
    login() {
      const user = {
        email: this.email,
        password: this.password
      };
      fetch(loginURL, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(user),
        headers: { "content-type": "application/json" }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then(user => {
          localStorage.user = user;
          this.$router.push("/");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
});
</script>

<style scoped lang="scss">
</style>
