<template>
  <div class="mx-2">
    <v-row>
      <v-col cols="8">
        <Map />
      </v-col>
      <v-col cols="4">
        <PathManager />
      </v-col>
    </v-row>
    <PreferenceManager />
    <RoutingControls />
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
