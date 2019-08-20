<template>
  <div class="map-container">
    <l-map
      :zoom="zoom"
      :center="center"
      @click="handleLeftClick"
      @update:zoom="updateZoom"
      @update:center="updateCenter"
      style="z-index: 1"
    >
      <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
      <l-marker v-for="(point, index) in waypoints" :key="index" :lat-lng="point">
        <l-tooltip>{{ index }}</l-tooltip>
      </l-marker>
      <l-polyline :lat-lngs="path.coordinates" color="green">
        <l-tooltip>
          <p>
            <strong>Total Cost: {{ path.totalCost }}</strong>
          </p>
          <p v-for="(tag, index) in path.costTags" :key="index">
            {{ tag }}:
            {{ path.costs[index] }}
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
import { LMap, LTileLayer, LMarker, LTooltip, LPolyline } from 'vue2-leaflet';

import { Coordinate, Path } from '@/types/types';
import RoutingState from '@/store/modules/routing';

@Component({
  name: 'MapComponent',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPolyline,
  },
})
export default class Map extends Vue {
  private zoom: number = 15;
  private center: Coordinate = { lat: 48.9666, lng: 9.4005 };

  get waypoints() {
    return RoutingState.waypoints;
  }

  get path(): Path {
    return RoutingState.path;
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
  height: 400px;
}
</style>
