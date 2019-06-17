import axios from 'axios';

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        fetchShortestPath(state: any, data: any) {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:8000/routing/fsp', data)
                    .then((response) => resolve(response.data))
                    .catch((error) => reject(error));
            });
        },
    },
};
