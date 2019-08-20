<template>
  <div class="mt-4">
    <v-btn @click="clear">Clear Waypoints</v-btn>
    <v-btn @click="reset">Reset Data</v-btn>
  </div>
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