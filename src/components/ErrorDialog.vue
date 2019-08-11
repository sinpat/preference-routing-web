<template>
  <v-dialog :value="errorMessage" max-width="300" persistent>
    <v-alert :value="!!errorMessage" type="error" border="bottom">{{
      errorMessage
    }}</v-alert>
    <v-btn v-if="hasRetryFunction" @click="tryAgain">
      <v-icon left>mdi-replay</v-icon>
      Wiederholen
    </v-btn>
    <v-btn @click="dismiss">
      <v-icon left>mdi-close</v-icon>
      Schließen
    </v-btn>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ErrorState from '@/store/modules/error';

@Component({
  name: 'ErrorDialogComponent',
})
export default class ErrorDialog extends Vue {
  get errorMessage() {
    return ErrorState.message;
  }

  get hasRetryFunction() {
    return ErrorState.hasRetryFunction;
  }

  private tryAgain() {
    ErrorState.tryAgain();
  }

  private dismiss() {
    ErrorState.reset();
  }
}
</script>
