<template>
  <div>
    <RoutingMapMarker
      v-for="(point, index) in waypoints"
      :key="index"
      :point="point"
      :index="index"
    />
    <l-polyline
      v-if="markerIsDragged"
      :lat-lngs="tempPath"
      color="brown"
    ></l-polyline>
    <l-polyline
      v-else-if="subPaths.length === 0"
      @click="addWaypoint"
      :lat-lngs="selectedRoute.coordinates"
      :bubbling-mouse-events="false"
      color="brown"
    >
    </l-polyline>
    <div v-else>
      <l-polyline
        v-for="([path, color], index) in subPaths"
        @click="addWaypoint"
        :key="index"
        :lat-lngs="path"
        :color="color"
        :bubbling-mouse-events="false"
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
import RoutingMapMarker from './RoutingMapMarker.vue';

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

  get tempPath() {
    return RoutingState.tempPath;
  }

  get markerIsDragged() {
    return RoutingState.markerIsDragged;
  }

  private addWaypoint({ latlng }: any) {
    RoutingState.addIntermediateWaypoint(latlng);
  }
}
</script>