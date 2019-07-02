<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <label>Username:&nbsp;</label>
      <input v-model="username" type="text" />
      <br />
      <label>Password:&nbsp;</label>
      <input v-model="password" type="password" />
      <br />
      <input type="submit" value="Login" />
    </form>
    <p>&nbsp;OR&nbsp;</p>
    <button @click="register">Register</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import userState from '@/store/modules/user';

@Component
export default class Login extends Vue {
  private name: string = 'Login';
  private username: string = '';
  private password: string = '';

  private login() {
    userState
      .login({
        username: this.username,
        password: this.password,
      })
      .then(() => this.$router.push({ name: 'home' }))
      .catch(() => {
        alert('Login unsuccessful');
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
