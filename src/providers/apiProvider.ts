import { Configuration } from "../api/runtime";
import { VueConstructor } from "vue/types/umd";
import { AuthApi } from "../api/apis/AuthApi";
import { UserApi, TranslationsApi, CdnApi, TmwApi } from '@/api';
import store from '../store'
const getApiKey = (name: string) => {
  if(process.env.LOG_VERBOSE !== 'false')  console.log("Getting token");
  return localStorage.getItem("token") || "";
};

const apiConfig = new Configuration({
  basePath: process.env.VUE_APP_API_URL,
  apiKey: getApiKey,
  middleware:[{pre(context){
    
  return new Promise((res,rej)=>{
    store.dispatch('loader/show')
    res()
  });
  
  },post(context){
    
  return new Promise((res,rej)=>{
    store.dispatch('loader/hide')
    res()
  });
  
  }}]
});

export default {
  install(vue: VueConstructor) {
    if(process.env.LOG_VERBOSE !== 'false') console.log("Installing API Plugin");
    vue.prototype.$auth = new AuthApi(apiConfig)

//vue.component.prototype.$auth = new AuthApi();
    vue.prototype.$userApi = new UserApi(apiConfig);
//vue.component.prototype.$userApi = new UserApi();
    vue.prototype.$tmwApi = new TmwApi(apiConfig);
  //  vue.component.prototype.$tmwApi = new TmwApi();
    vue.prototype.$translationApi = new TranslationsApi(apiConfig);
    vue.prototype.$cdnApi = new CdnApi(apiConfig);
  //  vue.component.prototype.$translationApi = new TranslationsApi();
  },
};
