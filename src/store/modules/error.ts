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
  public text: string = '';
  private error: any = null;
  private retryFunction: any = null;

  get hasRetryFunction(): boolean {
    return !!this.retryFunction;
  }

  get message(): string {
    if (!this.text) {
      return '';
    }
    return this.text + this.error;
  }

  @Mutation
  public set({ text, error, callback }: any) {
    this.text = text;
    this.error = error;
    this.retryFunction = callback;
  }

  @Mutation
  public reset() {
    this.text = '';
    this.error = null;
    this.retryFunction = null;
  }

  @Mutation
  public tryAgain() {
    this.text = '';
    this.error = null;
    this.retryFunction = null;
    this.retryFunction();
  }
}

export default getModule(ErrorState);
