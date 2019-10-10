<template>
  <l-polyline v-if="route" :lat-lngs="route.coordinates" color="red">
    <l-tooltip>
      <p>
        <strong>Total Cost: {{ route.total_cost | round }}</strong>
      </p>
      <p v-for="(tag, index) in costTags" :key="index">
        {{ tag }}:
        {{ route.costs[index] | round }}
        ({{ route.alpha[index] }})
      </p>
    </l-tooltip>
  </l-polyline>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';

import { LPolyline, LTooltip, LPopup } from 'vue2-leaflet';

import { IPath } from '@/types';
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
  @Prop({ required: true }) private route!: any;

  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  get costTags(): string[] {
    return RoutingState.costTags;
  }
}
</script>