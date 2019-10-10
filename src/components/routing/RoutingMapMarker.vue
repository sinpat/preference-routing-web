<template>
  <l-marker
    @contextmenu="removeWaypoint(index)"
    @update:latLng="repositionWaypoint"
    @dragstart="isDragged = true"
    @dragend="isDragged = false"
    :lat-lng="point"
    draggable
  >
    <l-tooltip>{{ index + 1 }}</l-tooltip>
    <l-popup>
      <h3 class="mb-2">Position</h3>
      <v-btn-toggle @change="changeOrder" :value="index" mandatory rounded>
        <v-btn v-for="(point, index) in waypoints" :key="index">{{
          index + 1
        }}</v-btn>
      </v-btn-toggle>
    </l-popup>
  </l-marker>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ICoordinate } from '@/types';
import RoutingState from '@/store/modules/routing';

import { LMarker, LTooltip, LPopup } from 'vue2-leaflet';

@Component({
  name: 'WaypointMarkerComponent',
  components: {
    LMarker,
    LTooltip,
    LPopup,
  },
})
export default class RoutingMapMarker extends Vue {
  @Prop({ type: Number, required: true })
  private index: any;

  @Prop({ type: Object, required: true })
  private point: any;

  private isDragged = false;

  get waypoints() {
    return RoutingState.waypoints;
  }

  private changeOrder(value: number) {
    RoutingState.swapWaypoints({
      from: this.index,
      to: value,
    });
  }

  private repositionWaypoint(newLoc: ICoordinate) {
    if (this.isDragged) {
      RoutingState.repositionWaypoint({
        index: this.index,
        newLoc,
      });
    }
  }

  private removeWaypoint(index: number) {
    RoutingState.removeWaypoint(index);
  }
}
</script>
