<template>
  <v-container>
    <v-row dense>
      <v-col>
        <RoutingMap />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="8">
        <RoutingPreferenceManager />
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

import RoutingMap from './RoutingMap.vue';
import RoutingPreferenceManager from './RoutingPreferenceManager.vue';
import RoutingControls from './RoutingControls.vue';

@Component({
  name: 'RoutingComponent',
  components: {
    RoutingMap,
    RoutingPreferenceManager,
    RoutingControls,
  },
})
export default class Routing extends Vue {}
</script>
