<template>
  <div>
    <v-row dense>
      <v-col>
        <RoutingMap class="elevation-4" />
      </v-col>
      <v-col>
        <RouteManager class="elevation-4" />
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
import { Watch } from 'vue-property-decorator';

import RoutingMap from './map/Map.vue';
import RouteManager from './RouteManager.vue';
import RoutingPreferenceManager from './RoutingPreferenceManager.vue';

import RoutingState from '@/store/modules/routing';
import PreferenceState from '@/store/modules/preference';

import apiService from '@/api-service';

@Component({
  name: 'RoutingComponent',
  components: {
    RoutingMap,
    RouteManager,
    RoutingPreferenceManager,
  },
})
export default class Routing extends Vue {
  private async created() {
    await RoutingState.init();
  }

  // private reset() {
  //   this.showDialog = false;
  //   RoutingState.resetData();
  // }
}
</script>
