<template>
  <div class="login">
    <form class="login-form">
      <v-text-field v-model="username" label="Username" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
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

@Component({
  name: 'LoginView',
})
export default class Login extends Vue {
  private username: string = '';
  private password: string = '';

  private login() {
    UserState.login({
      username: this.username,
      password: this.password,
    })
      .then(() => this.$router.push({ name: 'home' }))
      .catch(error => {
        ErrorState.set({ text: 'Login unsuccessful', error });
        this.username = '';
        this.password = '';
      });
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
