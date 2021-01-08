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
                <v-form @submit.prevent="submit" @keyup.native.enter="login"  ref="form"
    v-model="valid"
    lazy-validation>
                  <v-text-field
                  v-model="username"
                    label="Login"
                    :rules="nameRules"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                  v-model="password"
                  :rules="passwordRules"
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

<v-snackbar v-model="snackbar">{{ message }}</v-snackbar>
  </section>

</template>

<script lang="ts">
import Vue from "vue";
import { AuthApi, PostAuthLoginRequest } from "../../api/apis/AuthApi";
import Component from "vue-class-component";
import {VSnackbar} from 'vuetify/lib'
// const googleLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/google`;
// const facebookLoginURL: string = `${process.env.VUE_APP_API_URL}/auth/facebook`;
// const loginURL: string = `${process.env.VUE_APP_API_URL}/auth/login`;
// const authCheckURL: string = `${process.env.VUE_APP_API_URL}`;
//import { AuthApi } from "../../api/apis/AuthApi";
@Component({components:{VSnackbar}})
export default class Login extends Vue {
  name: "login";
  snackbar = false;
  username: string = "";
  password: string = "";
  message="Incorrect username or password.";
  valid = true;
  nameRules =[(v)=> {
    debugger
    return (!!v && this.valid) || 'Incorrect username or password'
    }
    ]
  passwordRules =[(v)=> { 
    debugger
    return (!!v && this.valid) || 'Incorrect username or password'
  }
  ]
  // loginGoogle() {
  //   window.location.href = googleLoginURL;
  // }
  // loginFacebook() {
  //   window.location.href = facebookLoginURL;
  // }
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  async login() {
    let auth: AuthApi = this.$auth;
    try {
      let authResponse = await auth
        .postAuthLogin({
          body: { username: this.username, password: this.password },
        })
        .catch((err) => {
          this.snackbar = true;
          this.username = '';
          this.password = '';
          this.valid=false;
          (this as any).$refs.form.validate();
          if (process.env.LOG_ERROR !== "false") console.log(err);
        });
      if (authResponse) {
        localStorage.token = authResponse.token;
        localStorage.user = JSON.stringify(authResponse.userJson);
        if (!authResponse.userJson.verified) {
          this.$router.push("/verify");
        } else {
          if (authResponse.userJson.needsNewPassword) {
            this.$router.push("/change");
          } else {
            if (
              window.location.search &&
              window.location.search.indexOf("return_to") !== -1
            ) {
              window.location.href = `https://fst.sisense.com/jwt?jwt=${
                localStorage.token
              }&return_to=${this.getParameterByName(
                "return_to",
                window.location.search
              )}`;
            } else {
              this.$router.push('/');
            }
          }
        }
      }else{
        this.snackbar = true;
       
        this.username = '';
          this.password = '';
           this.valid=false;
          (this as any).$refs.form.validate();
      }
    } catch (error) {
      if (process.env.LOG_ERROR !== "false") console.log(error);
    }
  }
}
</script>

<style scoped lang="scss">
</style>
