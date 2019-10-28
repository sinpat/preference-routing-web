import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import apiService from '@/api-service';

import store from '../store';

import NotificationState from './notification';
import ErrorState from './error';

@Module({
  dynamic: true,
  name: 'preferenceState',
  store,
})
class Preference extends VuexModule {
  public preference: number[][] = [];
  public prefIndex: number = 0;

  get currentPref() {
    return this.preference[this.prefIndex];
  }

  @Mutation
  public selectPref(index: number) {
    this.prefIndex = index;
  }

  @Action({ rawError: true })
  public async fetchPreference() {
    const preference = await apiService.getPreference();
    this.setPreference(preference);
  }

  @Action({ rawError: true })
  public async addPreference(pref: number[]) {
    this.preference.push(pref);
    this.selectPref(this.preference.length - 1);
    await apiService.postPreference(this.preference);
    NotificationState.setMessage('Preference added');
  }

  @Action({ rawError: true })
  public async newPreference() {
    const preference = await apiService.newPreference();
    this.setPreference(preference);
    this.selectPref(this.preference.length - 1);
  }

  @Action({ rawError: true })
  public async savePreference(preference: number[][]) {
    try {
      await apiService.postPreference(preference);
      NotificationState.setMessage('Preference saved');
      this.setPreference(preference);
    } catch (error) {
      ErrorState.set({
        text: 'Could not save preference',
        error,
        callback: () => this.savePreference(preference),
      });
    }
  }

  @Action({ rawError: true })
  public async deletePreference() {
    const prefIndex = this.prefIndex;
    if (prefIndex === this.preference.length - 1) {
      this.selectPref(prefIndex - 1);
    }
    this.preference.splice(prefIndex, 1);
    await apiService.postPreference(this.preference);
    NotificationState.setMessage('Preference deleted');
  }

  @Mutation
  public clearState() {
    this.preference = [];
    this.prefIndex = 0;
  }

  @Mutation
  private setPreference(pref: number[][]) {
    this.preference = pref;
  }
}

export default getModule(Preference);
