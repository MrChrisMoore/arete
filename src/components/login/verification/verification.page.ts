import Vue from 'vue';
import Component from 'vue-class-component';
import { AuthApi } from '@/api/apis/AuthApi';
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
@Component({ components: { VuePhoneNumberInput } })
export default class VerificationPage extends Vue {
  phone: string = '';
  code: string = '';
  codeSent: boolean = false;
  hasErrorActive = false;
  phoneObject:any={};
  onUpdate(payload) {
    this.hasErrorActive = !payload.isValid;
    this.phoneObject = payload;
  }
  callFunc() {
    if (this.codeSent) { this.verifySendCode() }
    else { this.verifyGetCode() }
  }
  async verifyGetCode() {
    let phone = this.phoneObject.formattedNumber.replace('+', '');
    
    let response = await this.$auth.getAuthSms({ phone: phone }).catch((err) => {
      if (process.env.LOG_ERROR !== 'false') console.log(err);
    });

    if (response) {
      this.codeSent = true;
    }
  }

  async verifySendCode() {
    let phone = this.phoneObject.formattedNumber.replace('+', '');
    
    let response = await this.$auth.postAuthSms({ body: { code: this.code, phone: phone } }).catch((err) => {
      if (process.env.LOG_ERROR !== 'false') console.log(err);
    });
    if(typeof response === 'string')
    localStorage.setItem("tempVerification", response)
    
    if (response) {
      this.$router.push('/change');
    }

  }
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.$router.push("/login");
  }
}


