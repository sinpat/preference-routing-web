<template>
  <div>
    <v-card v-for="(point, index) in waypoints" :key="index" hover>
      <v-card-text>
        {{ index }}: {{ point }}
        <v-spacer></v-spacer>
        <v-btn v-if="index !== 0" @click="waypointUp(index)" icon>
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn v-if="index !== waypoints.length - 1" @click="waypointDown(index)" icon>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <v-btn @click="removeWaypoint(index)" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-btn v-if="waypoints.length >= 2" @click="fetchRoute" text icon large color="blue">
      <v-icon>mdi-replay</v-icon>
    </v-btn>
    <v-btn v-if="waypoints.length > 2" @click="routeFinished" text icon large color="green">
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

  private waypointUp(index: number) {
    RoutingState.moveWaypointUp(index);
  }

  private waypointDown(index: number) {
    RoutingState.moveWaypointDown(index);
  }

  private removeWaypoint(index: number) {
    RoutingState.removeWaypoint(index);
  }

  private routeFinished() {
    RoutingState.getNewPreference();
  }
}
</script>