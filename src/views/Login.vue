<template>
  <div class="login">
    <h1>Login</h1>
    <AuthInput @submit="login" class="mt-4" />
    <v-btn @click="register">Register</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import AuthInput from '@/components/AuthInput.vue';

import ErrorState from '@/store/modules/error';
import apiService from '@/api-service';
import { ICredentials } from '../types/types';

@Component({
  name: 'LoginView',
  components: { AuthInput },
})
export default class Login extends Vue {
  private async login(credentials: ICredentials, errorCallback: any) {
    try {
      const token = await apiService.login(credentials);
      localStorage.setItem('token', token);
      this.$router.push({ name: 'home' });
    } catch (error) {
      errorCallback();
      ErrorState.set({ text: 'Login unsuccessful', error });
    }
  }

  private register() {
    this.$router.push({ name: 'register' });
  }
}
</script>

<style lang="scss" scoped>
.login-form input {
  margin-top: 0.5rem;
}
</style>
