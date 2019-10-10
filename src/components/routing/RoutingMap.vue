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
      <l-control-layers position="topright"></l-control-layers>
      <l-tile-layer
        v-for="provider in tileProviders"
        :key="provider.name"
        :name="provider.name"
        :visible="provider.visible"
        :attribution="provider.attribution"
        :url="provider.url"
        layer-type="base"
      />
      <l-control position="bottomleft">
        <v-card elevation="4">
          <v-btn
            @click="routeFinished"
            :disabled="waypoints.length < 2"
            icon
            color="green"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <br />
          <v-btn @click="clearRoute" :disabled="waypoints.length < 1" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card>
      </l-control>
      <RoutingMapMarker
        v-for="(point, index) in waypoints"
        :key="index"
        :point="point"
        :index="index"
      />
      <RoutingMapPath :route="selectedRoute" />
      <RoutingMapPath :route="path" />
    </l-map>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import L from 'leaflet';
import {
  LMap,
  LControl,
  LControlLayers,
  LTileLayer,
  LFeatureGroup,
} from 'vue2-leaflet';

import RoutingMapMarker from './RoutingMapMarker.vue';
import RoutingMapPath from './RoutingMapPath.vue';

import { ICoordinate, IPath } from '@/types/types';
import RoutingState from '@/store/modules/routing';
import apiService from '../../api-service';

@Component({
  name: 'MapComponent',
  components: {
    LMap,
    LControl,
    LControlLayers,
    LTileLayer,
    RoutingMapMarker,
    RoutingMapPath,
    LFeatureGroup,
  },
})
export default class RoutingMap extends Vue {
  // tslint:disable:max-line-length
  private tileProviders = [
    {
      name: 'OpenStreetMap',
      visible: true,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    {
      name: 'Thunderforest',
      visible: false,
      url:
        'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=bd08b205580548d18e6235e2da754318',
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ];
  private zoom: number = 18;
  private center: ICoordinate = { lat: 48.9745, lng: 9.402 };
  private drivenPaths: IPath[] = [];

  get waypoints() {
    return RoutingState.waypoints;
  }

  get prefIndex() {
    return RoutingState.prefIndex;
  }

  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  get path() {
    return RoutingState.path;
  }

  private created() {
    this.$store.watch(
      () => RoutingState.waypoints,
      RoutingState.fetchShortestPath
    );
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

  private clearRoute() {
    RoutingState.clear();
  }

  private routeFinished() {
    RoutingState.findNewPreference();
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  height: 600px;
}
</style>
