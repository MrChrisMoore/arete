



import Vue from 'vue'

import { AuthApi, TranslationsApi } from '../api/apis';
import { UserApi } from '@/api/apis/UserApi';
import { ReportsApi } from '@/api/apis/ReportsApi';


declare module 'vue/types/vue' {
  export interface Vue {
    auth: AuthApi,
    userApi:UserApi,
    reportsApi?:ReportsApi, 
    translationApi?:TranslationsApi
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
      reportsApi?:ReportsApi,
      translationApi?:TranslationsApi
  }
}

// declare module 'vue/types/vue' {
//   // Global properties can be declared
//   // on the `VueConstructor` interface
//  export interface VueConstructor {
//     $auth: AuthApi,
//     $user:UserApi
//   }
// }

// // ComponentOptions is declared in types/options.d.ts
// declare module 'vue/types/options' {
//  export interface ComponentOptions<V extends Vue> {
//     auth?: AuthApi,
//     user?:UserApi
//   }
  
// }