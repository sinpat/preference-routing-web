<template>
  <l-marker :lat-lng="point">
    <l-tooltip>{{ index }}</l-tooltip>
    <l-popup>
      <v-btn v-if="index !== 0" @click="waypointUp(index)" icon>
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      <v-btn v-if="index !== waypoints.length - 1" @click="waypointDown(index)" icon>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-btn @click="removeWaypoint(index)" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </l-popup>
  </l-marker>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

import { LMarker, LTooltip, LPopup } from 'vue2-leaflet';

@Component({
  name: 'WaypointMarkerComponent',
  props: { index: Number, point: Object },
  components: {
    LMarker,
    LTooltip,
    LPopup,
  },
})
export default class PathManager extends Vue {
  get waypoints() {
    return RoutingState.waypoints;
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
}
</script>
