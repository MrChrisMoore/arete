



import Vue from 'vue'

import { AuthApi } from '../api/apis';

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
 export interface VueConstructor {
    $auth: AuthApi
  }
}

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
 export interface ComponentOptions<V extends Vue> {
    auth?: AuthApi
  }
  
}