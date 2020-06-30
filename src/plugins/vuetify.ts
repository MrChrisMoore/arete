import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@/sass/overrides.sass'
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark:true,
    themes: {
      light: {
        primary: '#114474',
        secondary: '#53C5EE',
        accent: '#9FE118',
        error: '#FF5252',
        info: '#2196F3',
        success: '#54AE18',
        warning: '#FFC107'
      },
      dark: {
        primary: '#114474',
        secondary: '#53C5EE',
        accent: '#9FE118',
        error: '#FF5252',
        info: '#2196F3',
        success: '#54AE18',
        warning: '#FFC107'
      },
    },
  },
});
