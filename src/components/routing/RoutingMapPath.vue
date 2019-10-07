<template>
  <l-polyline v-if="path" :lat-lngs="path.coordinates" color="red">
    <l-tooltip>
      <p>
        <strong>Total Cost: {{ path.total_cost | round }}</strong>
      </p>
      <p v-for="(tag, index) in costTags" :key="index">
        {{ tag }}:
        {{ path.costs[index] | round }}
        ({{ path.alpha[index] }})
      </p>
    </l-tooltip>
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
}
</script>