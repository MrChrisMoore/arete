<template>
<v-container id="wh-dashboard" fluid fill-height tag="section">
    <!-- <v-row>
        <v-col cols="12" lg="12"> -->
            <!-- <base-material-card > -->
  <iframe src="https://fst.sisense.com/app/main#/dashboards/5c7edec258336113d4b2d725/?embed=true" id="ifm" name="ifm" width="100%" height="92%" frameborder="0" ></iframe>
            <!-- </base-material-card> -->
        <!-- </v-col>
    </v-row> -->
</v-container>
</template>

<script>
const API_URL = `${process.env.VUE_APP_API_URL}/auth`;
export default {
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
                  localStorage.user = JSON.stringify(result.user);
          }
        } else {
            this.$router.push('/login')
        }
      });
    }
}
}
</script>

<style scoped lang="scss">
#wh-dashboard{
    align-items: flex-start;
}
</style>