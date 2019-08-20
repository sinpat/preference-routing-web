<template>
  <div>
    <v-row dense>
      <v-col cols="3">
        <strong>Current Preference:</strong>
      </v-col>
      <v-col>{{ preference }}</v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'PreferenceManagerComponent',
})
export default class PreferenceManager extends Vue {
  private created() {
    RoutingState.fetchPreference();
  }

  get preference(): number[] | string {
    const preference = RoutingState.preference;
    if (preference.length === 0) {
      return 'None';
    }
    return preference;
  }
}
</script>