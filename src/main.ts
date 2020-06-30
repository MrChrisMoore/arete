import Vue from 'vue';
import App from './App.vue';
import './plugins/chartist';
import './plugins/base';
import './registerServiceWorker';
import i18n from './i18n'
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false


new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
