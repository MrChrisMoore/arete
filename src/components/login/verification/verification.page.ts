import Vue from 'vue';
import Component from 'vue-class-component';
import { AuthApi } from '@/api/apis/AuthApi';

@Component
export default class VerificationPage extends Vue {
 phone:string = '';
 code:string = '';
 codeSent:boolean = false;
 callFunc(){
   if(this.codeSent){this.verifySendCode()}
   else{this.verifyGetCode()}
 }
  async verifyGetCode(){
    

    let response = await this.auth.getAuthSms({phone:this.phone}).catch((err) => {
      if(process.env.LOG_ERROR !== 'false') console.log(err);
    });

    if(response){
      this.codeSent = true;
    }
  }

async verifySendCode(){
 

  let response = await this.auth.postAuthSms({body:{code:this.code, phone:this.phone}}).catch((err) => {
    if(process.env.LOG_ERROR !== 'false') console.log(err);
  });

  if(response){
   this.$router.push('/dashboard');
  }

  
}

}


