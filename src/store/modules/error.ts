import {
  Module,
  VuexModule,
  Mutation,
  Action,
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
  private callback: any = null;

  get hasRetryFunction(): boolean {
    return !!this.callback;
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
    this.callback = callback;
  }

  @Mutation
  public reset() {
    this.text = '';
    this.error = null;
    this.callback = null;
  }

  @Action
  public tryAgain() {
    const callback = this.callback;
    this.reset();
    callback();
  }
}

export default getModule(ErrorState);
