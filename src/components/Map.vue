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
      <l-polyline :lat-lngs="path" color="green">
        <l-tooltip>{{ pathCost }}</l-tooltip>
      </l-polyline>
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
  private center: Coordinate = { lat: 48.7447, lng: 9.1022 };

  get source() {
    return routingState.Source;
  }

  get target() {
    return routingState.Target;
  }

  get path(): Coordinate[] {
    return routingState.path;
  }

  get pathCost(): number {
    return routingState.pathCost;
  }

  private updateZoom(zoomValue: number) {
    this.zoom = zoomValue;
  }

  private updateCenter(centerValue: Coordinate) {
    this.center = centerValue;
  }

  private handleLeftClick({ latlng }: any) {
    routingState.sourceInput(latlng);
  }

  private handleRightClick({ latlng }: any) {
    routingState.targetInput(latlng);
  }
}
</script>

<style lang="scss">
.map {
  height: 400px;
}
</style>

