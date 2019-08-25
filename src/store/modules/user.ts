import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import store from '../store';

import apiService from '@/api-service';

@Module({
  dynamic: true,
  name: 'userState',
  store,
})
class User extends VuexModule {
  private token: string = sessionStorage.getItem('token') || '';

  get loggedIn(): boolean {
    return !!this.token;
  }

  @Action
  public async login(credentials: any) {
    try {
      const token = await apiService.login(credentials);
      this.setToken(token);
    } catch (error) {
      throw error;
    }
  }

  @Action
  public logout() {
    this.removeToken();
  }

  @Mutation
  private setToken(token: string) {
    this.token = token;
    sessionStorage.setItem('token', token);
  }

  @Mutation
  private removeToken() {
    this.token = '';
    sessionStorage.removeItem('token');
  }
}

export default getModule(User);
