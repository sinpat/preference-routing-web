<template>
  <v-card>
    <v-card-title>Configuration</v-card-title>
    <v-card-text>
      <v-row>
        <v-col style="font-size: 1.1rem">
          Waypoint Instertion Order
        </v-col>
        <v-col>
          <v-btn-toggle
            @change="setInsertionOrder"
            :value="insertionOrder"
            mandatory
            rounded
          >
            <v-btn value="in_order">In Order</v-btn>
            <v-btn value="intermediate">Intermediate</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <RoutingControls />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ConfigState from '@/store/modules/config';
import RoutingControls from './RoutingControls.vue';

@Component({
  name: 'RoutingConfigurationComponent',
  components: {
    RoutingControls,
  },
})
export default class RoutingConfiguration extends Vue {
  get insertionOrder() {
    return ConfigState.insertionOrder;
  }

  private setInsertionOrder(value: string) {
    ConfigState.setInsertionOrder(value);
  }
}
</script>