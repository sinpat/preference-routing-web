<template>
  <l-marker
    @contextmenu="removeWaypoint(index)"
    @update:latLng="updateWaypoint"
    @dragstart="dragStart"
    @dragend="dragEnd"
    :lat-lng="point"
    draggable
  >
    <l-tooltip>{{ index + 1 }}</l-tooltip>
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

  get isDragged() {
    return RoutingState.markerIsDragged;
  }

  private dragStart() {
    RoutingState.startWaypointDragging();
  }

  private dragEnd() {
    RoutingState.stopWaypointDragging();
    RoutingState.fetchShortestPath();
  }

  private updateWaypoint(newLoc: ICoordinate) {
    if (this.isDragged) {
      RoutingState.repositionWaypoint({ index: this.index, newLoc });
    }
  }

  private removeWaypoint(index: number) {
    RoutingState.removeWaypoint(index);
  }
}
</script>
