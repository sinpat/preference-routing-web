<template>
  <l-polyline v-if="path" :lat-lngs="path.coordinates" color="green">
    <l-tooltip>
      <p>
        <strong>Total Cost: {{ path.total_cost | round }}</strong>
      </p>
      <p v-for="(cost, index) in path.costs" :key="index">
        {{ costTags[index] }}:
        {{ cost | round }}
        ({{ path.alpha[index] }})
      </p>
    </l-tooltip>
    <l-popup>
      <v-btn @click="clearRoute" icon large light>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <!-- <v-btn @click="fetchRoute" icon large color="blue">
        <v-icon>mdi-replay</v-icon>
      </v-btn> -->
      <v-btn @click="routeFinished" icon large color="green">
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </l-popup>
  </l-polyline>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { LPolyline, LTooltip, LPopup } from 'vue2-leaflet';

import { IPath } from '@/types/types';
import RoutingState from '@/store/modules/routing';

@Component({
  name: 'PathComponent',
  components: {
    LPolyline,
    LTooltip,
    LPopup,
  },
  filters: {
    round: (value: number) => value.toFixed(2),
  },
})
export default class RoutingMapPath extends Vue {
  get path() {
    return RoutingState.path;
  }

  get costTags(): string[] {
    return RoutingState.costTags;
  }

  private clearRoute() {
    RoutingState.clear();
  }

  private fetchRoute() {
    RoutingState.fetchShortestPath();
  }

  private routeFinished() {
    RoutingState.findNewPreference();
  }
}
</script>