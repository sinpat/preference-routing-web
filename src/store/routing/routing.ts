import endpoints from '../endpoints';
import axios from 'axios';

export default {
  namespaced: true,

  state: {
    source: null,
    target: null,
    path: null,
  },

  getters: {
    source: (state: any) => state.source,
    target: (state: any) => state.target,
    path: (state: any) => state.path,
  },

  actions: {
    setSource({ state, dispatch }: any, latlng: object) {
      state.source = latlng;
      axios.post(endpoints.setSource, latlng).then(response => {
        state.source = response.data;
        if (state.target) {
          dispatch('fetchShortestPath');
        }
      });
    },
    setTarget({ state, dispatch }: any, latlng: object) {
      state.target = latlng;
      axios.post(endpoints.setTarget, latlng).then(response => {
        state.target = response.data;
        if (state.source) {
          dispatch('fetchShortestPath');
        }
      });
    },
    fetchShortestPath({ state }: any) {
      /*
      axios
        .post(endpoints.fsp, { source: state.source, target: state.target })
        .then(response => {
          state.path = response.data;
        });
      */
      state.path = [state.source, state.target];
    },
  },
};
