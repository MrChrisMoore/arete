<template>
  <v-main>
    <v-layout justify-center align-center fluid v-resize="onResize" fill-height>
      <v-flex text-xs-center fill-height>
        <router-view />
        <!-- <dashboard-core-footer /> -->
      </v-flex>
    </v-layout>
  </v-main>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { DataTableHeader } from 'vuetify';
import {Resize} from 'vuetify/lib/directives'
@Component({
  components: {
  },
    name: 'DashboardCoreView',
  directives:{Resize}
})

export default class Main extends Vue{
  
 windowSize = {
    x: 0,
    y: 0,
  }

  onResize() {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }
    // components: {
    //   DashboardCoreFooter: () => import('./Footer'),
    // },
  }
</script>
