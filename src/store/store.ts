import Vue from 'vue';
import Vuex from 'vuex';

import routing from './routing/routing';
import user from './user/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { routing, user },
});
