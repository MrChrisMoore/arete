



import Vue from 'vue'

import { AuthApi,  TranslationsApi } from '../api/apis';
import { UserApi } from '@/api/apis/UserApi';
import { TmwApi } from '@/api/apis/TmwApi';


declare module 'vue/types/vue' {
  export interface Vue {
    $auth: AuthApi,
    $userApi:UserApi,
    //reportsApi?:ReportsApi, 
    $translationApi?:TranslationsApi,
    $tmwApi?:TmwApi
  }
}

declare module 'vue/types/options' {
  export interface ComponentOptions<
    V extends Vue,
    Data=DefaultData<V>,
    Methods=DefaultMethods<V>,
    Computed=DefaultComputed,
    PropsDef=PropsDefinition<DefaultProps>,
    Props=DefaultProps> {
      auth?: AuthApi,
      userApi?:UserApi,
     // reportsApi?:ReportsApi,
      translationApi?:TranslationsApi,
      tmwApi?:TmwApi
  }
}