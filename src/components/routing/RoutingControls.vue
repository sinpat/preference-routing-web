<template>
  <v-card elevation="4">
    <v-card-title>Actions</v-card-title>
    <v-card-actions>
      <v-btn @click="clear">Clear Waypoints</v-btn>
      <v-btn @click="reset">Reset Data</v-btn>
    </v-card-actions>
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