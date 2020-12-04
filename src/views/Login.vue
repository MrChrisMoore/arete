<template>
  <v-container id="user-login" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">  
        <transition name="fade" mode="in-out"  appear>
        <!-- <v-img id="login-logo" src="../assets/logo.svg" height="50%" width="50%" contain></v-img> -->
        </transition>
        <transition name="fade" mode="in-out"  appear>
        
        <login></login>
        </transition>
      </v-col>
    </v-row>
   
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src

import Login from "../components/login/login.vue";
import {  VSlideYReverseTransition } from 'vuetify/lib';
export default {
  name: "LoginPage",
  components: { Login, VSlideYReverseTransition }
};
</script>

<style lang="scss" scoped>
#login-logo {
  margin: auto;
}
.fade-enter{
    opacity: 0;
    transform: scale(.5);
}

.fade-enter-active{
    transition: all 1s ease;
    //  transition-delay: 100000;
}
</style>