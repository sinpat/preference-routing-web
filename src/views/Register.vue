<template>
  <div class="register">
    <h1>Create new account</h1>
    <AuthInput :callback="register" />
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
  name: 'RegisterView',
  components: { AuthInput },
})
export default class Register extends Vue {
  private async register(credentials: ICredentials) {
    try {
      const token = await apiService.register(credentials);
      localStorage.setItem('token', token);
      this.$router.push({ name: 'home' });
    } catch (error) {
      ErrorState.set({ text: 'Register unsuccessful', error });
    }
  }
}
</script>