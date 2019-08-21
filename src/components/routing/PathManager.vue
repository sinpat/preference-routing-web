<template>
  <div class="text-center">
    <v-btn v-if="waypoints.length >= 2" @click="fetchRoute" icon large color="blue">
      <v-icon>mdi-replay</v-icon>
    </v-btn>
    <v-btn v-if="waypoints.length > 2" @click="routeFinished" icon large color="green">
      <v-icon>mdi-check</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'PathManagerComponent',
})
export default class PathManager extends Vue {
  get waypoints() {
    return RoutingState.waypoints;
  }

  private fetchRoute() {
    RoutingState.fetchShortestPath();
  }

  private routeFinished() {
    RoutingState.getNewPreference();
  }
}
</script>
