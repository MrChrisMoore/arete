



import Vue from 'vue'



declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
 export interface VueConstructor {
    $chartist:any
  }
}

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
 export interface ComponentOptions<V extends Vue> {
    chartist?:any
  }
  
}