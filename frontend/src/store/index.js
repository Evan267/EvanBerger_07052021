import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAdmin: null,
    modif: false
  },
  mutations: {
    getUserId(state, userId) {
      state.user = userId;
    },
    getAdmin(state, admin) {
      state.isAdmin = admin;
    },
    modif(state, modification){
      state.modif = modification;
    }
  },
})
