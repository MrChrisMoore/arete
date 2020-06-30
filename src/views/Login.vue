<template>
<v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Login Form
            </div>            
          </template>

     
    <v-img src="../assets/logo-1.svg" height="100%" width="100%" contain></v-img>
    <login></login>

        </base-material-card>
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
