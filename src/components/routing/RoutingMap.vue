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
      <RoutingMapMarker
        v-for="(point, index) in waypoints"
        :key="index"
        :point="point"
        :index="index"
      />
      <RoutingMapPath />
      <div v-if="showAll">
        <RoutingDrivenPath
          v-for="(path, index) in drivenPaths"
          :key="index"
          :path="path"
        />
      </div>
    </l-map>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import L from 'leaflet';
import { LMap, LTileLayer } from 'vue2-leaflet';

import RoutingMapMarker from './RoutingMapMarker.vue';
import RoutingMapPath from './RoutingMapPath.vue';
import RoutingDrivenPath from './RoutingDrivenPath.vue';

import { ICoordinate, IPath } from '@/types/types';
import RoutingState from '@/store/modules/routing';
import apiService from '../../api-service';

@Component({
  name: 'MapComponent',
  components: {
    LMap,
    LTileLayer,
    RoutingMapMarker,
    RoutingMapPath,
    RoutingDrivenPath,
  },
})
export default class RoutingMap extends Vue {
  /* TODO
   * Make marker draggable?
   * Introduce own icon for markers
   * Toggle map tile layout
   */
  private tileUrl: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  // private tileUrl: string =
  //   'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=bd08b205580548d18e6235e2da754318';
  private zoom: number = 18;
  private center: ICoordinate = { lat: 48.9745, lng: 9.402 };
  private drivenPaths: IPath[] = [];

  get waypoints() {
    return RoutingState.waypoints;
  }

  get showAll() {
    return RoutingState.showAll;
  }

  @Watch('showAll')
  private async fetchDrivenRoutes(value: boolean) {
    if (value) {
      const routes = await apiService.getDrivenRoutes();
      this.drivenPaths = routes;
    }
  }

  private updateZoom(zoomValue: number) {
    this.zoom = zoomValue;
  }

  private updateCenter(centerValue: ICoordinate) {
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
