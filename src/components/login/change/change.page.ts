import Vue from 'vue';
import Component from 'vue-class-component';
import { required, minLength, sameAs, helpers } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { Validations } from "vuelidate-property-decorators";
@Component({
  mixins: [validationMixin],
  components: {
  },
  name: 'change-page',
})
/*
Minimum eight characters, at least one letter and one number:

"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
Minimum eight characters, at least one letter, one number and one special character:

"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:

"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:

"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:

"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"
*/
export default class ChangePage extends Vue {
  current: string = '';
  newPass: string = '';
  confirm: string = '';
  showCurrent: boolean = false;
  showNew: boolean = false;
  showConfirm: boolean = false;
  passRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  @Validations()
  validations = {
    current: {
      required,
    },
    newPass: {
      required,
      minLength: minLength(8),
      special: helpers.regex('special', this.passRegex)
    },
    confirm: {
      required,
      sameAs: sameAs('newPass')
    }
  }
  get currentErrors() {
    const errors = [];
    if (!this.$v.current.$dirty) return errors;
    !this.$v.current.required &&
      !this.current &&
      errors.push('Please enter you current password');
    return errors;
  }
  get newPassErrors() {
    const errors = [];
    if (!this.$v.newPass.$dirty) return errors;
    !this.$v.newPass.required && !this.newPass && errors.push("This field is required");
    !this.$v.newPass.special && errors.push("Password does not meet requirements:", 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character');
    // !this.$v.newPass.minLength && errors.push("Password does not meet requirements")
    return errors;
  }
  get confirmErrors() {
    const errors = [];
    if (!this.$v.confirm.$dirty) return errors;

    !this.$v.confirm.required && !this.confirm && errors.push("This field is required");
    !this.$v.confirm.sameAs && errors.push("Passwords do not match")

    return errors;
  }
  async go() {
    let response = await this.auth.postAuthReset({ body: { password: this.current, newPassword: this.newPass } });

    //need to delete temp verification here if the password change is success
  }
}


