import Vue from 'vue';
import Component from 'vue-class-component';
import { required, minLength, sameAs , helpers} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { Validations } from "vuelidate-property-decorators";
@Component({
  mixins: [validationMixin],
  components: {
  },
  name: 'change-page',
})

export default class ChangePage extends Vue {
  current: string = '';
  newPass: string = '';
  confirm: string = '';
  passRegex:RegExp =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  @Validations()
  validations = {
    current: {
      required,
    },
    newPass: {
      required,
      minLength: minLength(8),
      special:helpers.regex('special', this.passRegex)
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
    !this.$v.newPass.special && errors.push("Password does not meet requirements");
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
  go() {

    //need to delete temp verification here if the password change is success
  }
}


