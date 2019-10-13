<template>
  <div>
    <RoutingMapMarker
      v-for="(point, index) in waypoints"
      :key="index"
      :point="point"
      :index="index"
    />
    <l-polyline
      v-if="subPaths.length === 0"
      :lat-lngs="selectedRoute.coordinates"
      color="brown"
    >
    </l-polyline>
    <div v-else>
      <l-polyline
        v-for="([path, color], index) in subPaths"
        :key="index"
        :lat-lngs="path"
        :color="color"
      >
      </l-polyline>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';

import { LPolyline, LTooltip, LPopup } from 'vue2-leaflet';

import { ICoordinate } from '@/types';
import RoutingState from '@/store/modules/routing';
import RoutingMapMarker from '@/components/routing/RoutingMapMarker.vue';

@Component({
  name: 'PathComponent',
  components: {
    LPolyline,
    LTooltip,
    LPopup,
    RoutingMapMarker,
  },
  filters: {
    round: (value: number) => value.toFixed(2),
  },
})
export default class RoutingMapPath extends Vue {
  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  get costTags(): string[] {
    return RoutingState.costTags;
  }

  get waypoints(): ICoordinate[] {
    return RoutingState.waypoints;
  }

  get subPaths() {
    return this.selectedRoute.subPaths;
  }
}
</script>