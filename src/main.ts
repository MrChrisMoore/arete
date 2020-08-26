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
import '@mdi/font/css/materialdesignicons.css';
import api from './providers/apiProvider';


//Vue.use(VueColumnsResizable);



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

