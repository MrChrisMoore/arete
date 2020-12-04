<template>
  <v-main class="v-main" >
    <v-container fluid >
      <!-- <v-layout class="main-layout"> -->
        <!-- <v-flex class="main-flex"> -->
          <transition name="page" mode="out-in">
          <router-view />
          </transition>
          <!-- <dashboard-core-footer /> -->
        <!-- </v-flex> -->
      <!-- </v-layout> -->
    </v-container>
  </v-main>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import { DataTableHeader } from "vuetify";
import { Resize } from "vuetify/lib/directives";
@Component({
  components: {},
  name: "DashboardCoreView",
  directives: { Resize },
})
export default class Main extends Vue {}
</script>
<style lang="scss">
// .v-main{
//   max-height: 100%;
// }
// .v-main__wrap,
// .main-layout,
// .main-flex {
//   height:calc(100vh - 48px);
//   max-height: calc(100vh - 48px);
//   overflow-y: hidden;
//   overflow-y: auto;
// }
.fill-height-or-more {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
} 

.fill-height-or-more > div {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}
// .main-container {
//   height:100%;
//   max-height: calc(100vh - 48px);
//   overflow-y: hidden;
//   overflow-y: auto;
// }
// .main-div{
//     height:100%;
//     max-height:calc(100vh - 80px);
// }

// .main-card {
//     height:100%;
//     max-height:calc(100vh - 84px);
// }
// .main-material-card {
//     height: 100%;
//     max-height: calc(100vh - 117px);
// }
.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>