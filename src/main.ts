import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import App from './App.vue';
import router from './router/router';
import store from './store/store';

import './registerServiceWorker';

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi', // Default - only for display purposes
    },
  }),
  render: h => h(App),
}).$mount('#app');
