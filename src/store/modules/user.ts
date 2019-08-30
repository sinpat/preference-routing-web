import { Module, VuexModule, getModule } from 'vuex-module-decorators';

import store from '../store';

@Module({
  dynamic: true,
  name: 'userState',
  store,
})
class User extends VuexModule {}

export default getModule(User);
