<template>
<v-container id="wh-orders" fluid fill-height tag="section">
   
  <iframe src="https://fst.sisense.com/app/main#/dashboards/5f187c668fadb7002ed96eb9/?embed=true&filters=Kill%20Cliff" id="ifm" name="ifm" width="100%" height="92%" frameborder="0" ></iframe>
       
</v-container>
</template>

<script lang="ts">


export default {
// async mounted(){
    
//     if(!localStorage.user){
//       let auth: AuthApi =(this as any).auth;
  
//     let creds = await auth.getAuth().catch((err) => {
//      if(process.env.LOG_ERROR !== 'false')  console.log(err);
//     });
//     if (creds) {
//       localStorage.user = JSON.stringify(creds);      
//     }
//     else{
//       this.$router.push('/login');
//     }
//     }
// }
}
</script>

<style scoped lang="scss">
#wh-dashboard{
    align-items: flex-start;
}
</style>