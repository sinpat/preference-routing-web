<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label>Username:&nbsp;</label>
      <input v-model="username" type="text">
      <br>
      <label>Password:&nbsp;</label>
      <input v-model="password" type="password">
      <br>
      <input type="submit">
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private username = '';
  private password = '';

  private login() {
    this.$store.dispatch('login', { username: this.username, password: this.password });
    this.$router.push({ name: 'home' });
  }
}
</script>

