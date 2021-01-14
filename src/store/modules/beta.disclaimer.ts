import { UserApi } from "@/api";
import { Module, Store } from "vuex";

export const disclaimer =  {
    namespaced: true,
    state: {
        showDisclaimer: false
    },
    actions: {
        showDisclaimer({ commit }) {
            commit("show");
        },
       async hideDisclaimer({ commit }) {           
           debugger 

          // console.log(this._vm);
          await this._vm.$userApi.postUserUpdate({body:{key:'showDisclaimer', value:'false'}});
          debugger
            commit("hide");
        }
    },
    mutations: {
        show(state) {
            state.showDisclaimer = true;
        },
        hide(state) {
            state.showDisclaimer = false;
        }
    }
  }