import axios from 'axios';
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import store from '../store';
import endpoints from '../endpoints';

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
  public login(credentials: any) {
    return new Promise((resolve, reject) => {
      axios
        .post(endpoints.login, credentials)
        .then(response => {
          this.setToken(response.headers.Authorization);
          resolve();
        })
        .catch(error => reject(error));
    });
  }

  @Action
  public logout() {
    this.removeToken();
  }

  @Action
  public verifyToken() {
    const token: string = sessionStorage.getItem('token') || '';
    axios
      .post(endpoints.verifyToken, token)
      .then(() => this.setToken(token))
      .catch(this.removeToken);
  }

  @Mutation
  private setToken(token: string) {
    this.token = token;
    sessionStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = token;
  }

  @Mutation
  private removeToken() {
    this.token = '';
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  }
}

export default getModule(User);
