<template>
  <div class="login-page">
    <v-img src="../assets/logo-1.svg" height="100%" width="100%" contain></v-img>
    <login></login>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src

import Login from "../components/login/login.vue";

export default {
  name: "LoginPage",
  components: { Login }
};
</script>
