<template>
  <v-container>
    <v-row dense>
      <v-col>
        <Map />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="8">
        <PreferenceManager />
      </v-col>
      <v-col cols="4">
        <RoutingControls />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Map from './Map.vue';
import PreferenceManager from './PreferenceManager.vue';
import RoutingControls from './RoutingControls.vue';

@Component({
  name: 'RoutingComponent',
  components: {
    Map,
    PreferenceManager,
    RoutingControls,
  },
})
export default class Routing extends Vue {}
</script>
