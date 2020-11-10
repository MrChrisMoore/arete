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


// import  "ag-grid-enterprise";
//import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
//import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";

//Vue.use(VueColumnsResizable);
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)


Vue.use(Vuelidate);
Vue.config.productionTip = false;
Vue.use(api);

const app = new Vue({
  router,
  store,
  i18n,  
  vuetify,  
  validations: {},
  render: h => h(App)
}).$mount('#app')

