<template>
  <div class="map">
    <l-map
      :zoom="zoom"
      :center="center"
      @click="handleLeftClick"
      @contextmenu="handleRightClick"
      @update:zoom="updateZoom"
      @update:center="updateCenter"
    >
      <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
      <l-marker v-if="source" :lat-lng="source">
        <l-tooltip>Source</l-tooltip>
      </l-marker>
      <l-marker v-if="target" :lat-lng="target">
        <l-tooltip>Target</l-tooltip>
      </l-marker>
      <l-polyline v-if="path" :lat-lngs="path" color="green"></l-polyline>
    </l-map>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LTooltip, LPolyline } from 'vue2-leaflet';

import { Coordinate } from '@/types/types';
import routingState from '@/store/modules/routing';

@Component({
  components: { LMap, LTileLayer, LMarker, LTooltip, LPolyline },
})
export default class Map extends Vue {
  private name: string = 'Map';
  private zoom: number = 14;
  private center: [number, number] = [48.66, 8.598];

  get source(): Coordinate {
    return routingState.source;
  }
  get target(): Coordinate {
    return routingState.target;
  }
  get path(): Coordinate[] {
    return routingState.path;
  }

  private updateZoom(zoomValue: number) {
    this.zoom = zoomValue;
  }

  private updateCenter(centerValue: any) {
    this.center = centerValue;
  }

  private fetchRoute() {
    routingState.fetchShortestPath();
  }

  private handleLeftClick({ latlng }: any) {
    routingState.setSource(latlng);
  }

  private handleRightClick({ latlng }: any) {
    routingState.setTarget(latlng);
  }
}
</script>

<style lang="scss">
.map {
  height: 400px;
}
</style>

