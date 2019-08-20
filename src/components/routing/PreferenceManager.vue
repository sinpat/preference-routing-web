<template>
  <div>
    <v-card elevation="4">
      <v-card-title>
        Current Preference
        <v-spacer></v-spacer>
        <v-btn v-if="!isEditing" @click="fetchPreference" icon small>
          <v-icon>mdi-replay</v-icon>
        </v-btn>
        <v-btn @click="toggleEditing" :disabled="!prefValid" icon small>
          <v-icon>{{ isEditing ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-for="(value, index) in preference" :key="index" dense>
          <v-col cols="4">
            <strong>{{ costTags[index] }}:</strong>
          </v-col>
          <v-col>
            <v-text-field
              v-if="isEditing"
              v-model.number="preference[index]"
              :rules="[prefValueValid]"
            ></v-text-field>
            <strong v-else>{{ value }}</strong>
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

  get preference(): number[] {
    return RoutingState.preference;
  }

  get prefValid(): boolean {
    const sum = this.preference.reduce((acc, el) => acc + el, 0);
    const allValid = this.preference.every(this.valueInRange);
    return allValid && sum === 1;
  }

  private created() {
    this.fetchPreference();
  }

  private fetchPreference() {
    RoutingState.fetchPreference();
  }

  private prefValueValid(value: number) {
    return this.valueInRange(value) || 'Number has to be between 0 and 1';
  }

  private valueInRange(value: number) {
    return 0 <= value && value <= 1;
  }

  private toggleEditing() {
    this.isEditing = !this.isEditing;
  }
}
</script>