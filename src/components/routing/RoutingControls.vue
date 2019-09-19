<template>
  <v-card elevation="4" height="100%">
    <v-card-title class="mb-2">Actions</v-card-title>
    <v-card-text>
      <div>
        <v-btn @click="clear" block>Clear Path</v-btn>
        <br />
        <v-btn @click="reset" style="color: red" block>Reset Data</v-btn>
      </div>
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
  get waypoints() {
    return RoutingState.waypoints;
  }

  private clear() {
    RoutingState.clear();
  }

  private reset() {
    RoutingState.resetData();
  }
}
</script>