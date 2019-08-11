import {
  Module,
  VuexModule,
  Mutation,
  getModule,
} from 'vuex-module-decorators';

import store from '../store';

@Module({
  dynamic: true,
  name: 'applicationState',
  store,
})
class ErrorState extends VuexModule {
  public message: string = '';
  private retryFunction: any = null;

  get isRetryFunction(): boolean {
    return !!this.retryFunction;
  }

  @Mutation
  public set({ message, fun }: any) {
    this.message = message;
    if (fun) {
      this.retryFunction = fun;
    }
  }

  @Mutation
  public reset() {
    this.message = '';
    this.retryFunction = null;
  }

  @Mutation
  public tryAgain() {
    this.message = '';
    this.retryFunction();
  }
}

export default getModule(ErrorState);
