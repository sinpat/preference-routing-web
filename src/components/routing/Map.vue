<template>
  <div class="map-container elevation-4">
    <l-map
      :zoom="zoom"
      :center="center"
      @click="handleLeftClick"
      @update:zoom="updateZoom"
      @update:center="updateCenter"
      style="z-index: 1"
    >
      <l-tile-layer :url="tileUrl"></l-tile-layer>
      <WaypointMarker
        v-for="(point, index) in waypoints"
        :key="[index, point.lat, point.lng].join('-')"
        :point="point"
        :index="index"
      />
      <l-polyline :lat-lngs="path.coordinates" color="green">
        <l-tooltip>
          <p>
            <strong>Total Cost: {{ path.totalCost }}</strong>
          </p>
          <p v-for="(cost, index) in path.costs" :key="index">
            {{ costTags[index] }}:
            {{ cost }}
            ({{ path.alpha[index] }})
          </p>
        </l-tooltip>
      </l-polyline>
    </l-map>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import L from 'leaflet';
import { LMap, LTileLayer, LPolyline, LTooltip } from 'vue2-leaflet';

import WaypointMarker from './WaypointMarker.vue';

import { Coordinate, Path } from '@/types/types';
import RoutingState from '@/store/modules/routing';

@Component({
  name: 'MapComponent',
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LTooltip,
    WaypointMarker,
  },
})
export default class Map extends Vue {
  /* TODO
   * Make marker draggable?
   * Introduce own icon for markers
   * Toggle map tile layout
   */
  private tileUrl: string =
    'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=bd08b205580548d18e6235e2da754318';
  private zoom: number = 15;
  private center: Coordinate = { lat: 48.9666, lng: 9.4005 };

  get waypoints() {
    return RoutingState.waypoints;
  }

  get path(): Path {
    return RoutingState.path;
  }

  get costTags(): string[] {
    return RoutingState.costTags;
  }

  private updateZoom(zoomValue: number) {
    this.zoom = zoomValue;
  }

  private updateCenter(centerValue: Coordinate) {
    this.center = centerValue;
  }

  private handleLeftClick({ latlng }: any) {
    RoutingState.addWaypoint(latlng);
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  height: 450px;
}
</style>
