<template>
  <div class="mt-2">
    <h1>Login</h1>
    <AuthInput @submit="login" btnName="Log In" class="mt-4" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import AuthInput from '@/components/AuthInput.vue';

import ErrorState from '@/store/modules/error';
import UserState from '@/store/modules/user';
import { ICredentials } from '../types';

@Component({
  name: 'LoginView',
  components: { AuthInput },
})
export default class Login extends Vue {
  private async login(credentials: ICredentials, errorCallback: any) {
    try {
      await UserState.login(credentials);
      this.$router.push({ name: 'home' });
    } catch (error) {
      errorCallback();
      ErrorState.set({ text: 'Login unsuccessful', error });
    }
  }
}
</script>
