<template lang="html">
  <section class="login">
    <base-material-card class="elevation-12">
    <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Login
            </div>

            <div class="subtitle-1 font-weight-light">
             Enter username and password.
            </div>
          </template>
              <v-card-text>
                <v-form @submit.prevent="submit" @keyup.native.enter="login">
                  <v-text-field
                  v-model="username"
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
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
                <!-- <v-btn color="primary" @click="loginGoogle()">Google Login</v-btn>
                <v-btn color="primary" @click="loginFacebook()">Facebook Login</v-btn> -->
              </v-card-actions>
            </base-material-card>
  </section>

</template>

<script lang="ts">
import Vue from "vue";
import { AuthApi, PostAuthLoginRequest } from "../../api/apis/AuthApi";
import Component from 'vue-class-component';
// const googleLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/google`;
// const facebookLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/facebook`;
// const loginURL: string = `${process.env.VUE_APP_API_URL}/auth/login`;
// const authCheckURL: string = `${process.env.VUE_APP_API_URL}`;
//import { AuthApi } from "../../api/apis/AuthApi";
@Component
export default class Login extends Vue {
  name: "login";

  username: string = "";
  password: string = "";

  // loginGoogle() {
  //   window.location.href = googleLoginURL;
  // }
  // loginFacebook() {
  //   window.location.href = facebookLoginURL;
  // }
  async login() {
    let auth: AuthApi = this.auth;
    try {
      let authResponse = await auth
        .postAuthLogin({
          body: { username: this.username, password: this.password },
        })
        .catch((err) => {
          if (process.env.LOG_ERROR !== "false") console.log(err);
        });        
      if (authResponse) {
        localStorage.token = authResponse.token;
        localStorage.user = JSON.stringify(authResponse.userJson);
        if (!authResponse.userJson.verified) {
          
          this.$router.push("/verify");
        } else {
          if(authResponse.userJson.needsNewPassword){
            this.$router.push('/change');
          }else{

            this.$router.push('/examples');
          }
        }
      }
    } catch (error) {
      if (process.env.LOG_ERROR !== "false") console.log(error);
    }
  }
}
</script>

<style scoped lang="scss">
</style>
