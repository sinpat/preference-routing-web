<template>
  <div class="mx-2">
    <v-row>
      <v-col cols="9">
        <Map />
      </v-col>
      <v-col cols="3">
        <PathManager />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6">
        <PreferenceManager />
      </v-col>
      <v-col cols="6">
        <RoutingControls />
      </v-col>
    </v-row>
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
