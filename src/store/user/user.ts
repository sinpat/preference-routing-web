import axios from 'axios';

export default {
    namespaced: true,
    state: {
        token: sessionStorage.getItem('token') || '',
      },
      getters: {
        loggedIn: (state: any) => !!state.token,
      },
      mutations: {
        setToken(state: any, token: string) {
          state.token = token;
          sessionStorage.setItem('token', token);
          axios.defaults.headers.common.Authorization = token;
        },
        removeToken(state: any) {
          state.token = '';
          sessionStorage.removeItem('token');
          delete axios.defaults.headers.common.Authorization;
        },
      },
      actions: {
        login({ commit }: any, credentials: any) {
          return new Promise((resolve, reject) => {
            axios.post('http://localhost:8000/user/login', credentials)
              .then((response) => {
                commit('setToken', response.headers.Authorization);
                resolve();
              })
              .catch((error) => reject(error));
          });
        },
        logout({ commit }: any) {
          commit('removeToken');
        },
      },
}