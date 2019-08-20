<template>
  <div>
    <v-card elevation="4">
      <v-card-title>
        Current Preference
        <v-spacer></v-spacer>
        <v-btn v-if="!isEditing" @click="fetchPreference" icon small>
          <v-icon>mdi-replay</v-icon>
        </v-btn>
        <v-btn icon small>
          <v-icon @click="toggleEditing">{{ isEditing ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-for="(value, index) in preference" :key="index" dense>
          <v-col cols="4">
            <strong>{{ costTags[index] }}:</strong>
          </v-col>
          <v-col>
            <strong>{{ value }}</strong>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
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
  private costTags = ['Unsuitability', 'Distance', 'Height'];
  private isEditing = false;

  get preference(): number[] | string {
    const preference = RoutingState.preference;
    if (preference.length === 0) {
      return 'None';
    }
    return preference;
  }

  private created() {
    this.fetchPreference();
  }

  private fetchPreference() {
    RoutingState.fetchPreference();
  }

  private toggleEditing() {
    this.isEditing = !this.isEditing;
  }
}
</script>