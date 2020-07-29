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
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row v-if="user">
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Company (disabled)"
                    disabled
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    class="purple-input"
                    label="User Name"
                    v-model="user.cadenceProfile.LoginID"
                 
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Email Address"
                    class="purple-input"
                    v-model="user.email"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="First Name"
                    class="purple-input"
                    v-model="user.cadenceProfile.FirstName"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Last Name"
                    class="purple-input"
                    v-model="user.cadenceProfile.LastName"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Adress"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="City"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Country"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"          
        >
         <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Link 3rd Party Logins
            </div>            
          </template>
          <v-card-text class="text-center">
            
     <v-btn color="primary" @click="loginGoogle()">Google Login</v-btn>
                <v-btn color="primary" @click="loginFacebook()">Facebook Login</v-btn>
          
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const API_URL = `${process.env.VUE_APP_API_URL}/auth`;
import Vue from 'vue';
  export default Vue.extend({
    data:()=>({
      user:''
    }),
    mounted(){

       if(!localStorage.user){
        fetch(API_URL, {
            method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(result => {
          if (result.user) {
              if(result.user){           
                     this.$data
                  localStorage.user = JSON.stringify(result.user);
                  this.user = result.user;
          }
        } else {
            this.logout();
        }
      });
    }else{
      this.user = JSON.parse(localStorage.user);
      
     if(process.env.LOG_VERBOSE !== 'false')  console.log(this.user.cadenceProfile.LoginID)
    }
},
  
    methods:{
      getUser(){


      }
    }
  })
</script>
