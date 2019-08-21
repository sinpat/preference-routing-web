<template>
  <div class="my-2">
    <v-row dense>
      <v-col cols="9">
        <Map />
      </v-col>
      <v-col cols="3">
        <RoutingControls />
        <PathManager />
      </v-col>
    </v-row>
    <PreferenceManager />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Map from './Map.vue';
import PathManager from './PathManager.vue';
import PreferenceManager from './PreferenceManager.vue';
import RoutingControls from './RoutingControls.vue';

@Component({
  name: 'RoutingComponent',
  components: {
    Map,
    PathManager,
    PreferenceManager,
    RoutingControls,
  },
})
export default class Routing extends Vue {}
</script>
