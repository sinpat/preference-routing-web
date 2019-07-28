<template>
  <div class="map">
    <l-map
      :zoom="zoom"
      :center="center"
      @click="handleLeftClick"
      @contextmenu="handleRightClick"
      @update:zoom="updateZoom"
      @update:center="updateCenter"
      style="z-index: 0"
    >
      <l-tile-layer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-marker
        v-for="(point, index) in avoid"
        :key="'avoid' + index"
        :lat-lng="point"
      >
        <l-tooltip>Avoid</l-tooltip>
      </l-marker>
      <l-marker
        v-for="(point, index) in waypoints"
        :key="'include' + index"
        :lat-lng="point"
      >
        <l-tooltip>Include</l-tooltip>
      </l-marker>
      <l-polyline
        v-for="(path, index) in paths"
        :key="index"
        :lat-lngs="path.coordinates"
        color="green"
      >
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
import routingState from '@/store/modules/routing';

@Component({
  components: { LMap, LTileLayer, LMarker, LTooltip, LPolyline },
  name: 'MapComponent',
})
export default class Map extends Vue {
  private zoom: number = 14;
  private center: Coordinate = { lat: 48.6599, lng: 8.599 };

  get waypoints() {
    return routingState.waypoints;
  }

  get avoid() {
    return routingState.avoid;
  }

  get paths(): Path[] {
    return routingState.paths;
  }

  private updateZoom(zoomValue: number) {
    this.zoom = zoomValue;
  }

  private updateCenter(centerValue: Coordinate) {
    this.center = centerValue;
  }

  private handleLeftClick({ latlng }: any) {
    routingState.addWaypoint(latlng);
  }

  private handleRightClick({ latlng }: any) {
    routingState.avoidPoint(latlng);
  }
}
</script>

<style lang="scss" scoped>
.map {
  height: 400px;
}
</style>

