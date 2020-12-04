import Vue from 'vue';
import App from './App.vue';
import './plugins/chartist';
import './plugins/base';
import './registerServiceWorker';
import i18n from './i18n'
import router from './router';
import store from './store';
import Vuelidate from 'vuelidate';
import vuetify from './plugins/vuetify';
// import './plugins/googleCharts';
import '@mdi/font/css/materialdesignicons.css';
import api from './providers/apiProvider';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'


import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(Vuelidate);

Vue.config.productionTip = false;

Vue.use(api);
Vue.filter('toCurrency', function (value) {
  if (typeof value !== "number") {
      return value;
  }
  let formatter = new Intl.NumberFormat(window.navigator.language, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
  });
  return formatter.format(value);
});
Vue.filter('toMiles', function (value) {
  if (typeof value !== "number") {
      return value;
  }
  let formatter = new Intl.NumberFormat(window.navigator.language,<any> {
      style: 'unit',
      unit:'mile',
      maximumFractionDigits: 2
  });
  return formatter.format(value);
});
Vue.filter('toWeight', function (value) {
  if (typeof value !== "number") {
      return value;
  }
  let formatter = new Intl.NumberFormat(window.navigator.language,<any> {
      style: 'unit',
      unit:'pound',
      maximumFractionDigits: 2
  });
  return formatter.format(value);
});
Vue.filter('toString', function (value) {
  if (typeof value !== "number") {
      return value;
  }
  let formatter: any = new Intl.NumberFormat(window.navigator.language, {  
    maximumFractionDigits: 2
});
return formatter.format(value);
  
});
Vue.filter('toUpperCase',function(value){
  return value.toUpperCase();
});
Vue.filter('toDateString',function(value){
  return value? new Date(value).toLocaleString(navigator.language):'N/A';
})

Vue.prototype.$dateFields =['delivery appt', 'pickup', 'arrcons', 'depcons', 'arrship', 'depship'];
Vue.prototype.$dateTimeFields = ['delivery appt', 'arrcons', 'depcons', 'arrship', 'depship'];
Vue.prototype.$numericFields =['weight',  'cases', 'pallet', /* 'lead time', */ 'distance'];
Vue.prototype.$currencyFields =['misc', 'total charges', 'lumper admin', 'nyc', 'lumper', 'linehaul', 'fuel','detention','afterhours'];
Vue.prototype.$unitTypes = {
  weight: 'pound',
  distance: 'mile',
}
const app = new Vue({
  router,
  store,
  i18n,  
  vuetify,  
  validations: {},
  render: h => h(App)
}).$mount('#app')

