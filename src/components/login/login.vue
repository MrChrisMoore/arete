<template lang="html">
  <section class="login">
    <base-material-card class="elevation-12">
    <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Login
            </div>

            <div class="subtitle-1 font-weight-light">
             Enter Username and password or choose a login provider
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
const googleLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/google`;
const facebookLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/facebook`;
const loginURL: string = `${process.env.VUE_APP_API_URL}/auth/login`;
const authCheckURL: string = `${process.env.VUE_APP_API_URL}`;
//import { AuthApi } from "../../api/apis/AuthApi";

export default Vue.extend({
  name: "login",
  data: () => ({
    username: "",
    password: "",
  }),
  // async mounted() {
  //   let auth: AuthApi = (this as any).auth;
  //   let creds = await auth.getAuth().catch((err) => {
  //     console.log(err);
  //   });
  //   if (creds) {
  //     localStorage.user = JSON.stringify(creds);
  //     this.$router.push('/dashboard');
  //   }
  // },

  methods: {
    loginGoogle() {
      window.location.href = googleLoginURL;
    },
    loginFacebook() {
      window.location.href = facebookLoginURL;
    },
    login: async function () {
      let auth: AuthApi = (this as any).auth;
      try {
        let authResponse = await auth
          .postAuthLogin({
            body: { username: this.username, password: this.password },
          })
          .catch((err) => {
            if(process.env.LOG_ERROR !== 'false') console.log(err);
          });
        if  (authResponse) {
          localStorage.token = authResponse.token;
          this.$router.push("/sisense/wh-overview");
        }
      } catch (error) {
       if(process.env.LOG_ERROR !== 'false')  console.log(error);
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
