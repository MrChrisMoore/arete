import { Configuration } from "../api/runtime";
import { VueConstructor } from "vue/types/umd";
import { AuthApi } from "../api/apis/AuthApi";
import { UserApi, TranslationsApi } from '@/api';
import { ReportsApi } from '@/api/apis/ReportsApi';

const getApiKey = (name: string) => {
  if(process.env.LOG_VERBOSE !== 'false')  console.log("Getting token");
  return localStorage.getItem("token") || "";
};

const apiConfig = new Configuration({
  basePath: process.env.VUE_APP_API_URL,
  apiKey: getApiKey,
});

export default {
  install(vue: VueConstructor) {
    if(process.env.LOG_VERBOSE !== 'false') console.log("Installing API Plugin");
    vue.prototype.auth = new AuthApi(apiConfig);
    vue.component.prototype.$auth = new AuthApi();
    vue.prototype.userApi = new UserApi(apiConfig);
    vue.component.prototype.$userApi = new UserApi();
    vue.prototype.reportsApi = new ReportsApi(apiConfig);
    vue.component.prototype.$reportsApi = new ReportsApi();
    vue.prototype.translationApi = new TranslationsApi(apiConfig);
    vue.component.prototype.$translationApi = new TranslationsApi();
  },
};
