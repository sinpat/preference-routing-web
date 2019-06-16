import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem('user') || '',
  },
  getters: {
    loggedIn: (state) => !!state.token,
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
      sessionStorage.setItem('token', token);
    },
    removeToken(state) {
      state.token = '';
      sessionStorage.removeItem('token');
    },
  },
  actions: {
    login({ commit }, credentials) {
      axios.post('http://localhost:8000/user/login', credentials)
        .then((response) => commit('setToken', response.data))
        .catch((error) => console.log(error));
    },
    logout({ commit }) {
      commit('removeToken');
    },
  },
});
