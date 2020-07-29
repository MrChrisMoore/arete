<template>
  <v-container id="user-login" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-img id="login-logo" src="../assets/logo.svg" height="50%" width="50%" contain></v-img>
        <login></login>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src

import Login from "../components/login/login.vue";

export default {
  name: "LoginPage",
  components: { Login }
};
</script>

<style lang="scss" scoped>
#login-logo {
  margin: auto;
}
</style>