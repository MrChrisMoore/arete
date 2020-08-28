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
                  <v-text-field label="Company" :disabled="!isCreate" v-model="user.company['Company Name']" />
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
                  <v-autocomplete
                    label="Company"
                    :items="companies"
                    placeholder="Drop down or begin typing"
                    :disabled="!isCreate"
                    item-text="COMPANY NAME"
                    :error-messages="companyErrors"
                    v-model="newUser.company"
                    return-object
                    @blur="$v.company.$touch()"
                    @change="$v.company.$touch()"
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
                <!-- <v-col cols="12" md="6">
                  <v-text-field
                    :error-messages="phoneErrors"
                    label="Phone"
                    class="purple-input"
                    v-model="newUser.phone"
                    @change="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                  />
                </v-col>-->

                <v-col cols="12" md="6">
                  <VuePhoneNumberInput
                    dark
                    :error-messages="phoneErrors"
                    error-color="red"
                    label="Phone"
                    class="purple-input"
                    clearable
                    :error="hasErrorActive"
                    v-model="newUser.phone"
                    @change="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                    @update="onUpdate"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    label="Permission Level"
                    class="purple-input"
                    :items="permLevels"
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
    <v-row v-if="canAdd" justify="center">
      <v-col cols="12" md="4">
        <v-btn block color="secondary" dark @click="addMode()">Add User</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import {
  UserApi,
  AddUserModelPermissionLevelEnum,
  TranslationsApi,
  CompanyFromJSONTyped,
} from "../../../api";
import { required, minLength, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { Validations } from "vuelidate-property-decorators";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
const isPhone = (value) => {
  debugger;
  return /^1(3|4|5|7|8)\d{9}$/.test(value);
};
const isPerm = (value) => ["ADMIN", "USER", "SUPER"];

@Component({ mixins: [validationMixin], components: { VuePhoneNumberInput } })
export default class UserProfile extends Vue {
  headingText: string = "Review your profile";
  headingSubtitle: string = "";
  get permLevels() {
    return ["SUPER", "ADMIN", "USER"].filter((v, k) => {
      return this.user.permissionLevel === "SUPER" && v === "SUPER"
        ? v
        : v !== "SUPER" && v;
    });
  }
  hasErrorActive = false;
  canAdd = false;
  user = {
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    username: "",
    email: "",
    permissionLevel: "User",
  };
  newUser = {
    firstName: "",
    lastName: "",
    company: {},
    phone: "",
    username: "",
    email: "",
    permissionLevel: AddUserModelPermissionLevelEnum.USER,
  };

  companies = [];

  //permLevels: AddUserModelPermissionLevelEnum;

  isCreate: boolean = false;
  mounted() {
    this.user = JSON.parse(localStorage.user);
    this.canAdd =
      this.user.permissionLevel === "SUPER" ||
      this.user.permissionLevel === "ADMIN";
  }
  onUpdate(payload) {
    this.hasErrorActive = !payload.isValid;
  }
  @Validations()
  validations = {
    firstName: {
      required,
    },

    lastName: { required },
    company: { required },
    phone: { required, isPhone },
    username: { required },
    email: { required, email },
    permissionLevel: { isPerm },
  };
  async addMode() {
    this.isCreate = true;
    this.headingText = "Add user";
    this.headingSubtitle =
      "Please fill in the required information to add a user";
    this.companies = await this.translationApi.getTranslationsCompanies();
  }

  get firstNameErrors() {
    const errors = [];
    if (!this.$v.firstName.$dirty) return errors;
    !this.$v.firstName.required &&
      !this.newUser.firstName &&
      errors.push("First Name is required");
    return errors;
  }
  get lastNameErrors() {
    const errors = [];
    if (!this.$v.lastName.$dirty) return errors;
    !this.$v.firstName.required &&
      !this.newUser.lastName &&
      errors.push("Last Name is required");
    return errors;
  }
  get companyErrors() {
    const errors = [];
    if (!this.$v.company.$dirty) return errors;
    !this.$v.company.required &&
      !this.newUser.company &&
      errors.push("Company is required");
    return errors;
  }
  get phoneErrors() {
    const errors = [];
    if (!this.$v.phone.$dirty) return errors;
    debugger;
    !this.$v.phone.isPhone && errors.push("Must be a valid phone number");
    !this.$v.phone.required &&
      !this.newUser.phone &&
      errors.push("Phone is required.");
    return errors;
  }
  get emailErrors() {
    const errors = [];
    if (!this.$v.email.$dirty) return errors;
    !this.$v.email.email && errors.push("Must be valid e-mail");
    !this.$v.email.required &&
      !this.newUser.email &&
      errors.push("E-mail is required");
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
    !this.$v.username.required &&
      !this.newUser.username &&
      errors.push("Username is required.");
    return errors;
  }

  async save() {
    if (this.newUser && typeof this.newUser.company === "object") {
      this.newUser.company = CompanyFromJSONTyped(this.newUser.company, false);
    }
    // debugger
    let response = await this.userApi
      .postUserAdd({ body: this.newUser })
      .catch((err) => {
        console.log(err);
      });
    if (response) {
      this.newUser = {
        firstName: "",
        lastName: "",
        company: {},
        phone: "",
        username: "",
        email: "",
        permissionLevel: AddUserModelPermissionLevelEnum.USER,
      };
    }
  }
}
</script>
