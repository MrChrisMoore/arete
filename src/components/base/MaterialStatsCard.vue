<template>
  <base-material-card
    :icon="icon"
    class="v-card--material-stats"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:after-heading>
      <div class="ml-auto text-right">
        <div class="body-3 grey--text font-weight-light" v-text="title" />

        <h3 class="title font-weight-light text--primary">
          {{ value }} <small>{{ smallValue }}</small>
        </h3>
      </div>
    </template>

    <v-col cols="12" class="px-0">
      <v-divider />
    </v-col>

    <v-icon :color="subIconColorValue" size="16" class="ml-2 mr-1">
      {{ subIconValue }}
    </v-icon>

    <span
     v-if="subText2"
      :class="subTextColorValue ? subTextColorValue : 'grey--text'"
      class="caption font-weight-light"
      v-text="subText"
    />

    <v-spacer v-if="subText2" />
    <span
      v-if="subText2"
      v-text="subText2"
      :class="subTextColor ? subTextColor : 'grey--text'"
      class="caption font-weight-light"
    ></span>
    <v-spacer v-if="subText3" />
    <span
      v-if="subText3"
      v-text="subText3"
      :class="subTextColor ? subTextColor : 'grey--text'"
      class="caption font-weight-light"
    ></span>
    <v-spacer v-if="subText4" />
    <span
      v-if="subText4"
      v-text="subText4"
      :class="subTextColor ? subTextColor : 'grey--text'"
      class="caption font-weight-light"
    ></span>
  </base-material-card>
</template>

<script>
import { boolean } from "joi";
import Card from "./Card";

export default {
  name: "MaterialStatsCard",

  inheritAttrs: false,
  data() {
    return {
      subTextColorValue: this.$props.subTextColor,
      subIconValue:this.$props.subIcon,
      subIconColorValue:this.$props.subIconColor
    };
  },
  props: {
    ...Card.props,
    icon: {
      type: String,
      required: true,
    },
    decreaseIsBad: {
      type: Boolean,
      default: false,
    },
    subIcon: {
      type: String,
      default: undefined,
    },
    subIconColor: {
      type: String,
      default: undefined,
    },
    subTextColor: {
      type: String,
      default: undefined,
    },
    subText: {
      type: String,
      default: undefined,
    },
    subText2: {
      type: String,
      default: undefined,
    },
    subText3: {
      type: String,
      default: undefined,
    },
    subText4: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      default: undefined,
    },
    smallValue: {
      type: String,
      default: undefined,
    },
  },
  watch: {
    subText: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val, oldVal) {
        if (!val) return
        if(val.indexOf('$0.00') > -1) return
        if (val.indexOf("Decrease") > -1 && this.decreaseIsBad) {
          this.subTextColorValue = "red--text";
          this.subIconValue = 'mdi mdi-alert';
          this.subIconColorValue = 'red';
        } else {
          if (val.indexOf("Increase") > -1 && !this.decreaseIsBad) {
            this.subTextColorValue = "red--text";
            this.subIconValue = 'mdi mdi-alert';
            this.subIconColorValue = 'red';
          } else {
            this.subTextColorValue = "green--text";
            
            this.subIconColorValue = 'green'
            if(val.indexOf("Decrease") > -1 && !this.decreaseIsBad){
              this.subIconValue = 'mdi mdi-arrow-down';
            }
            if(val.indexOf("Increase") > -1 && this.decreaseIsBad){
              this.subIconValue = 'mdi mdi-arrow-up';
            }
          }
        }
      },
    },
    // subText(val){
    //   debugger

    // }
  },
};
</script>

<style lang="sass">
.v-card--material-stats
  display: flex
  flex-wrap: wrap
  position: relative

  > div:first-child
    justify-content: space-between

  .v-card
    border-radius: 4px
    flex: 0 1 auto

  .v-card__text
    display: inline-block
    flex: 1 0 calc(100% - 120px)
    position: absolute
    top: 0
    right: 0
    width: 100%

  .v-card__actions
    flex: 1 0 100%
</style>
