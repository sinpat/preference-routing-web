<template>
  <div>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs8 class="map-container">
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
        </v-flex>
        <v-flex>
          <v-card v-for="(point, index) in waypoints" :key="index" hover>
            <v-card-text>
              {{ index }}: {{ point }}
              <v-spacer></v-spacer>
              <v-btn v-if="index !== 0" @click="waypointUp(index)" icon>
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn v-if="index !== waypoints.length - 1" @click="waypointDown(index)" icon>
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn @click="removeWaypoint(index)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
          <v-btn v-if="waypoints.length > 2" @click="routeFinished">Done!</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn @click="clear">Clear Waypoints</v-btn>
    <v-btn @click="reset">Reset Data</v-btn>
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
  components: { LMap, LTileLayer, LMarker, LTooltip, LPolyline },
  name: 'MapComponent',
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

  private clear() {
    RoutingState.clear();
  }

  private reset() {
    RoutingState.resetData();
  }

  private routeFinished() {
    RoutingState.getNewPreference();
  }

  private waypointUp(index: number) {
    RoutingState.moveWaypointUp(index);
  }

  private waypointDown(index: number) {
    RoutingState.moveWaypointDown(index);
  }

  private removeWaypoint(index: number) {
    RoutingState.removeWaypoint(index);
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  height: 400px;
}
</style>

