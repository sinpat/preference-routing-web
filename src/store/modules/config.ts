import {
  VuexModule,
  Module,
  getModule,
  Mutation,
} from 'vuex-module-decorators';

import store from '../store';

@Module({
  dynamic: true,
  name: 'configState',
  store,
})
class Config extends VuexModule {
  public insertionOrder = 'intermediate';

  @Mutation
  public setInsertionOrder(value: string) {
    this.insertionOrder = value;
  }
}

export default getModule(Config);
