<template>
  <v-main class="v-main">
    <v-container fluid class="main-container">
      <v-layout class="main-layout">
        <v-flex class="main-flex">
          <transition name="page" mode="out-in">
          <router-view />
          </transition>
          <!-- <dashboard-core-footer /> -->
        </v-flex>
      </v-layout>
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
.v-main{
  max-height: 100%;
}
.v-main__wrap,
.main-layout,
.main-flex {
  height:100%;
  max-height: calc(100vh - 48px);
  overflow-y: hidden;
  overflow-y: auto;
}

.main-container {
  height:100%;
  max-height: calc(100vh - 48px);
  overflow-y: hidden;
  overflow-y: auto;
}
.main-div{
    height:100%;
    max-height:calc(100vh - 80px);
}

.main-card {
    height:100%;
    max-height:calc(100vh - 84px);
}
.main-material-card {
    height: 100%;
    max-height: calc(100vh - 117px);
}
.page-enter-active, .page-leave-active {
  transition: opacity 1s, transform 1s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>