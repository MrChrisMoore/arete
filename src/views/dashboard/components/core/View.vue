<template>
  <v-main style="max-height: 100%">
    <v-container class="main-container">
      <v-layout class="main-layout">
        <v-flex class="main-flex">
          <router-view />
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
.v-main__wrap,
.main-layout,
.main-flex {
  height:100%;
  max-height: 100%;
  overflow-y: hidden;
  overflow-y: auto;
}

.main-container {
  height:100%;
  max-height: calc(100vh - 48px);
  overflow-y: hidden;
  overflow-y: auto;
}
</style>