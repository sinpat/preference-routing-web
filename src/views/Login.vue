<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <label>Username:&nbsp;</label>
      <input v-model="username" type="text">
      <br>
      <label>Password:&nbsp;</label>
      <input v-model="password" type="password">
      <br>
      <input type="submit" value="Login">
    </form>
    <p>&nbsp;OR&nbsp;</p>
    <button @click="register">Register</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
    };
  },

  methods: {
    login() {
      this.$store
        .dispatch('user/login', {
          username: this.username,
          password: this.password,
        })
        .then(() => this.$router.push({ name: 'home' }))
        .catch(() => {
          alert('Login unsuccessful');
          this.username = '';
          this.password = '';
        });
    },

    register() {
      this.$router.push({ name: 'register' });
    },
  },
});
</script>

<style lang="scss" scoped>
.login-form {
  margin-top: 2rem;
}
.login-form input {
  margin-top: 0.5rem;
}
</style>
