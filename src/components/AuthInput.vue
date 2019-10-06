<template>
  <v-form v-model="credentialsValid">
    <v-text-field
      v-model="credentials.username"
      :rules="nameRules"
      label="Username"
      rounded
      outlined
    ></v-text-field>
    <v-text-field
      v-model="credentials.password"
      :rules="passwordRules"
      label="Password"
      type="password"
      rounded
      outlined
    ></v-text-field>
    <v-btn
      @click="submit"
      :disabled="!credentialsValid"
      color="success"
      rounded
      >{{ btnName }}</v-btn
    >
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ICredentials } from '../types/types';

@Component({
  name: 'AuthInputComponent',
})
export default class Register extends Vue {
  @Prop({ required: true }) private btnName!: string;
  private credentials: ICredentials = {
    username: '',
    password: '',
  };
  private credentialsValid: boolean = false;
  private nameRules = [(x: string) => !!x || 'Name is required'];
  private passwordRules = [
    (x: string) => !!x || 'Password is required',
    (x: string) => x.length >= 8 || 'Password has to be 8 characters or more',
  ];

  private async submit() {
    this.$emit('submit', this.credentials, () => {
      this.credentials.username = '';
      this.credentials.password = '';
    });
  }
}
</script>