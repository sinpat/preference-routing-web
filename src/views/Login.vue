<template>
  <div class="login">
    <form class="login-form">
      <v-text-field v-model="credentials.username" label="Username" required></v-text-field>
      <v-text-field v-model="credentials.password" label="Password" type="password" required></v-text-field>
      <v-btn @click="login">Login</v-btn>
      <v-btn @click="register">Register</v-btn>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import UserState from '@/store/modules/user';
import ErrorState from '@/store/modules/error';
import { ICredentials } from '../types/types';

@Component({
  name: 'LoginView',
})
export default class Login extends Vue {
  private credentials: ICredentials = {
    username: '',
    password: '',
  };

  private async login() {
    try {
      await UserState.login(this.credentials);
      this.$router.push({ name: 'home' });
    } catch (error) {
      ErrorState.set({ text: 'Login unsuccessful', error });
      this.credentials.username = '';
      this.credentials.password = '';
    }
  }

  private register() {
    this.$router.push({ name: 'register' });
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  margin-top: 2rem;
}
.login-form input {
  margin-top: 0.5rem;
}
</style>
