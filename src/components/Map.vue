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
    };
  },

  computed: {
    source(): object {
      return this.$store.getters['routing/source'];
    },
    target(): object {
      return this.$store.getters['routing/target'];
    },
  },

  methods: {
    updateZoom(zoomValue: number) {
      this.zoom = zoomValue;
    },

    updateCenter(centerValue: any) {
      this.center = centerValue;
    },

    fetchRoute() {
      this.$store.dispatch('routing/fetchShortestPath');
    },

    handleLeftClick({ latlng }: any) {
      this.$store.dispatch('routing/setSource', latlng);
    },

    handleRightClick({ latlng }: any) {
      this.$store.dispatch('routing/setTarget', latlng);
    },
  },
});
</script>

<style lang="scss">
.map {
  height: 400px;
}
</style>

