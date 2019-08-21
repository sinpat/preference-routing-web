<template>
  <v-card elevation="4">
    <v-card-title>Actions</v-card-title>
    <v-card-text>
      <v-btn @click="clear" block>Clear</v-btn>
      <br />
      <v-btn @click="reset" block>Reset</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'RoutingControlsComponent',
})
export default class RoutingControls extends Vue {
  private clear() {
    RoutingState.clear();
  }

  private reset() {
    RoutingState.resetData();
  }
}
</script>