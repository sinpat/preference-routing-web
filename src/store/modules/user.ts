import {
  Module,
  VuexModule,
  getModule,
  Mutation,
  Action,
} from 'vuex-module-decorators';

import apiService from '@/api-service';
import store from '../store';
import RoutingState from './routing';
import { ICredentials } from '@/types/types';

@Module({
  dynamic: true,
  name: 'userState',
  store,
})
class User extends VuexModule {
  private token = localStorage.getItem('token');

  get loggedIn() {
    return !!this.token;
  }

  @Mutation
  public logout() {
    this.token = '';
    localStorage.removeItem('token');
    RoutingState.clear();
  }

  @Action({ rawError: true })
  public async register(credentials: ICredentials) {
    await apiService.register(credentials);
  }

  @Action({ rawError: true })
  public async login(credentials: ICredentials) {
    const token = await apiService.login(credentials);
    this.setToken(token);
    localStorage.setItem('token', token);
  }

  @Mutation
  private setToken(token: string) {
    this.token = token;
  }
}

export default getModule(User);
