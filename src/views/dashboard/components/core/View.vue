<template>

  <v-main fill-height>
    <router-view />
    <dashboard-core-footer />
  </v-main>

</template>

<script>
  export default {
    name: 'DashboardCoreView',

    components: {
      DashboardCoreFooter: () => import('./Footer'),
    },
  }
</script>
