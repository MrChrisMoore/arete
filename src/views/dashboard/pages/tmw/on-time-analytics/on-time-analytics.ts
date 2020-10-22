import Vue from 'vue';
import Component from 'vue-class-component';
import {VContainer} from 'vuetify/lib'
@Component({
  components: {
    VContainer
  },
  name: 'on-time-analytics-',
})

export default class OnTimeAnalytics extends Vue {
  dates = ['2020-10-01', '2020-10-14'];
  menu= false
  get  dateRangeText () {
    return this.dates.join(' ~ ')
  }
}


