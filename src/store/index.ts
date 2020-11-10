import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    themeDark:false,
    drawer: null,
  },
  mutations: {
    
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },

    SET_THEMEDARK (state, payload) {      
      state.themeDark = payload
    },
  },
  actions: {

  },
})
