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
      <l-tile-layer :url="layerUrl"></l-tile-layer>
      <l-marker v-if="source" :lat-lng="source">
        <l-tooltip>Source</l-tooltip>
      </l-marker>
      <l-marker v-if="target" :lat-lng="target">
        <l-tooltip>Target</l-tooltip>
      </l-marker>
    </l-map>
    <button @click="fetchRoute">Calculate Route</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import L, { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LTooltip } from 'vue2-leaflet';

export default Vue.extend({
  name: 'Map',
  components: { LMap, LTileLayer, LMarker, LTooltip },

  data() {
    return {
      zoom: 14,
      center: [48.66, 8.598],
      layerUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      source: null,
      target: null,
    };
  },

  methods: {
    updateZoom(zoomValue: number) {
      this.zoom = zoomValue;
    },

    updateCenter(centerValue: any) {
      this.center = centerValue;
    },

    fetchRoute() {
      this.$store.dispatch('routing/fetchShortestPath', {
        source: this.source,
        target: this.target,
      });
    },

    handleLeftClick(event: any) {
      this.source = event.latlng;
    },

    handleRightClick(event: any) {
      this.target = event.latlng;
    },
  },
});
</script>

<style lang="scss">
.map {
  height: 400px;
}
</style>

