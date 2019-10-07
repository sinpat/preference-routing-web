<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="7" lg="8">
        <RoutingMap class="elevation-4" />
      </v-col>
      <v-col>
        <RoutingConfig class="elevation-4 fill-height" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <RoutingPreferenceManager class="elevation-4" />
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
import RoutingConfig from './RoutingConfiguration.vue';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'RoutingComponent',
  components: {
    RoutingMap,
    RoutingPreferenceManager,
    RoutingControls,
    RoutingConfig,
  },
})
export default class Routing extends Vue {
  private async created() {
    await RoutingState.init();
  }
}
</script>
