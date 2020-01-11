<template>
  <div class="mt-2">
    <h1>Create new account</h1>
    <AuthInput @submit="register" btnName="Register" class="mt-4" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import AuthInput from '@/components/AuthInput.vue';

import ErrorState from '@/store/modules/error';
import UserState from '@/store/modules/user';
import NotificationState from '@/store/modules/notification';
import apiService from '@/api-service';
import { ICredentials } from '../types';

@Component({
  name: 'RegisterView',
  components: { AuthInput },
})
export default class Register extends Vue {
  private async register(credentials: ICredentials, errorCallback: any) {
    try {
      await UserState.register(credentials);
      NotificationState.setMessage('Register successful');
      this.$router.push({ name: 'login' });
    } catch (error) {
      errorCallback();
      if (error.response.status === 401) {
        ErrorState.set({ text: 'Username already taken' });
      } else {
        ErrorState.set({ text: 'Register unsuccessful', error });
      }
    }
  }
}
</script>