<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">{{headingText}}</div>

            <div class="subtitle-1 font-weight-light">{{headingSubtitle}}</div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row v-if="!isCreate">
                <v-col cols="12" md="4">
                  <v-text-field label="Group Code" :disabled="!isCreate" v-model="user.groupCode" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field class="purple-input" label="User Name" v-model="user.username" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Email Address" class="purple-input" v-model="user.email" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="First Name" class="purple-input" v-model="user.firstName" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Last Name" class="purple-input" v-model="user.lastName" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Permission Level"
                    class="purple-input"
                    v-model="user.permissionLevel"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Phone" class="purple-input" v-model="user.phone" />
                </v-col>
                <!-- <v-col cols="12">
                  <v-text-field label="Adress" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="City" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Country" class="purple-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field class="purple-input" label="Postal Code" type="number" />
                </v-col>-->

                <!-- <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>-->
              </v-row>
              <v-row v-if="isCreate">
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Group Code"
                    :disabled="!isCreate"
                    :error-messages="groupCodeErrors"
                    v-model="newUser.groupCode"
                    @blur="$v.groupCode.$touch()"
                    @change="$v.groupCode.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    :error-messages="userNameErrors"
                    class="purple-input"
                    label="User Name"
                    v-model="newUser.username"
                    @blur="$v.username.$touch()"
                    @change="$v.username.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    :error-messages="emailErrors"
                    type="email"
                    label="Email Address"
                    class="purple-input"
                    v-model="newUser.email"
                    @change="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="firstNameErrors"
                    label="First Name"
                    class="purple-input"
                    v-model="newUser.firstName"
                    @change="$v.firstName.$touch()"
                    @blur="$v.firstName.$touch()"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="lastNameErrors"
                    label="Last Name"
                    class="purple-input"
                    v-model="newUser.lastName"
                    @change="$v.lastName.$touch()"
                    @blur="$v.lastName.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="phoneErrors"
                    label="Phone"
                    class="purple-input"
                    v-model="newUser.phone"
                    @change="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Permission Level"
                    class="purple-input"
                    :error-messages="permissionLevelErrors"
                    v-model="newUser.permissionLevel"
                    @change="$v.permissionLevel.$touch()"
                    @blur="$v.permissionLevel.$touch()"
                  />
                </v-col>
                <v-col cols="12" class="text-right" v-if="isCreate">
                  <v-btn color="success" class="mr-0" @click="save()">Save</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
      <!-- <v-col cols="12" md="4">
        <base-material-card class="v-card-profile">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Link 3rd Party Logins</div>
          </template>
          <v-card-text class="text-center">
            <v-btn color="primary" @click="loginGoogle()">Google Login</v-btn>
            <v-btn color="primary" @click="loginFacebook()">Facebook Login</v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>-->
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-btn block color="secondary" dark @click="addMode()">Add User</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { UserApi, AddUserModelPermissionLevelEnum } from "../../../api";
import { required, minLength, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { Validations } from "vuelidate-property-decorators";
const isPhone = (value) => /^1(3|4|5|7|8)\d{9}$/.test(value);
const isPerm = (value) => ["ADMIN", "USER", "SUPER"];

@Component({ mixins: [validationMixin] })
export default class UserProfile extends Vue {
  headingText: string = "Review your profile";
  headingSubtitle: string = "";

  user = {
    firstName: "",
    lastName: "",
    groupCode: "",
    phone: "",
    username: "",
    email: "",
    permissionLevel: "User",
  };
  newUser = {
    firstName: "",
    lastName: "",
    groupCode: "",
    phone: "",
    username: "",
    email: "",
    permissionLevel: AddUserModelPermissionLevelEnum.USER,
  };

  //permLevels: AddUserModelPermissionLevelEnum;

  isCreate: boolean = false;
  mounted() {
    this.user = JSON.parse(localStorage.user);
  }
  @Validations()
  validations = {
    firstName: {
      required,
    },

    lastName: { required },
    groupCode: { required },
    phone: { required, isPhone },
    username: { required },
    email: { required, email },
    permissionLevel: { isPerm },
  };
  addMode() {
    this.isCreate = true;
    this.headingText = "Add user";
    this.headingSubtitle =
      "Please fill in the required information to add a user";
  }

  get firstNameErrors() {
    const errors = [];
    if (!this.$v.firstName.$dirty) return errors;
    !this.$v.firstName.required && errors.push("First Name is required");
    return errors;
  }
  get lastNameErrors() {
    const errors = [];
    if (!this.$v.lastName.$dirty) return errors;
    !this.$v.firstName.required && errors.push("Last Name is required");
    return errors;
  }
  get groupCodeErrors() {
    const errors = [];
    debugger;
    if (!this.$v.groupCode.$dirty) return errors;
    !this.$v.groupCode.required && errors.push("Group Code is required");
    return errors;
  }
  get phoneErrors() {
    const errors = [];
    if (!this.$v.phone.$dirty) return errors;
    !this.$v.phone.isPhone && errors.push("Must be a valid phone number");
    !this.$v.phone.required && errors.push("Phone is required.");
    return errors;
  }
  get emailErrors() {
    const errors = [];
    if (!this.$v.email.$dirty) return errors;
    !this.$v.email.email && errors.push("Must be valid e-mail");
    !this.$v.email.required && errors.push("E-mail is required");
    return errors;
  }
  get permissionLevelErrors() {
    const errors = [];
    if (!this.$v.permissionLevel.$dirty) return errors;
    !this.$v.permissionLevel.isPerm && errors.push("Invalid Permission Level");
    return errors;
  }
  get userNameErrors() {
    const errors = [];
    if (!this.$v.username.$dirty) return errors;
    !this.$v.username.required && errors.push("Username is required.");
    return errors;
  }

  async save() {
    let response = await this.userApi.postUserAdd({ body: this.newUser });
          
  }
}
</script>
