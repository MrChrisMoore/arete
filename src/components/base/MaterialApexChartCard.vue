<template>
  <base-material-card
    class="v-card--material-apex-chart"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:heading>
      <apexchart
        :id="domid"        
        :width="width"
        :type="type"
        :height="height"
        :options="options"
        :series="series"
      ></apexchart>
    </template>

    <slot slot="reveal-actions" name="reveal-actions" />

    <slot />

    <slot slot="actions" name="actions" />
  </base-material-card>
</template>

<script>
// import ApexChart from 'vue-apexcharts';
export default {
  name: "MaterialApexChartCard",
  // components:{ApexChart},
  inheritAttrs: false,

  props: {
    domid:{type:String},
    options: {
      type: Object,
    },
    type: {
      type: String,
    },
    series: {
      type: Array,
      required: true,
      default: () => [],
    },
    width: {
      default: "100%",
    },
    height: {
      default: "auto",
    },
  },


};
</script>

<style lang="scss">
.v-card--material-apex-chart {
  p {
    color: #999;
  }

  .v-card--material__heading {
    max-height: 500px;
  }
}

.v-card--material-apex-chart {
  .apexcharts-theme-light {
    .apexcharts-tooltip-text {
      color: #333 !important;
    }
    .apexcharts-tooltip-title {
      color: #333 !important;
    }
  }
}
</style>
