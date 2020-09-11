import Vue from 'vue';
import Vuetify,{VLayout, VFlex,VDataIterator,VList,VListGroup,VListItem,VListItemContent,VCard,VCardTitle,VCardText,VCol,VDivider,VRow,VIcon,VBtn,VSpacer,VListItemTitle,VMenu,VBtnToggle,VSelect,VTextField,VToolbar} from 'vuetify/lib';
import '@/sass/overrides.sass'
//import '@mdi/font/css/materialdesignicons.css'
Vue.use(Vuetify,{components: {
  VLayout,VFlex,VDataIterator,VList,VListGroup,VListItem,VListItemContent,VCard,VCardTitle,VCardText,VCol,VDivider,VRow,VIcon,VBtn,VSpacer,VListItemTitle,VMenu,VBtnToggle,VSelect,VTextField,VToolbar
}});

export default new Vuetify({
  // icons: {
  //   iconfont: 'md', // default - only for display purposes
  // },
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
