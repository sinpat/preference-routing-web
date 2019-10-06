<template>
  <div>
    <v-row>
      <v-col>
        <RoutingControls />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <RoutingMap />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <RoutingPreferenceManager />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingMap from './RoutingMap.vue';
import RoutingPreferenceManager from './RoutingPreferenceManager.vue';
import RoutingControls from './RoutingControls.vue';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'RoutingComponent',
  components: {
    RoutingMap,
    RoutingPreferenceManager,
    RoutingControls,
  },
})
export default class Routing extends Vue {
  private async created() {
    await RoutingState.init();
  }
}
</script>
