<template>
  <v-card elevation="4" height="100%">
    <v-card-title class="mb-2">
      My Preferences
      <v-spacer></v-spacer>
      <div v-if="!isEditing">
        <!-- <v-btn @click="fetchPreference" icon small>
          <v-icon>mdi-replay</v-icon>
        </v-btn> -->
        <v-btn text icon small>
          <v-icon @click="addPreference">mdi-plus</v-icon>
        </v-btn>
        <v-btn @click="isEditing = true" icon small>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <v-btn v-else @click="savePreference" :disabled="!prefValid" icon small>
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="pb-0">
      <v-btn-toggle @change="switchPref" :value="prefIndex" rounded>
        <v-btn v-for="(alpha, index) in preferences" :key="index">
          {{ index }}
        </v-btn>
      </v-btn-toggle>
      <v-row class="mt-4" dense>
        <v-col
          v-for="(_, index) in selectedPref"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            v-model.number="selectedPref[index]"
            :readonly="!isEditing"
            :rules="[prefValueValid]"
            :label="costTags[index]"
            rounded
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'PreferenceManagerComponent',
})
export default class RoutingPreferenceManager extends Vue {
  private isEditing = false;

  get preferences(): number[][] {
    return RoutingState.preference;
  }

  get prefIndex(): number {
    return RoutingState.prefIndex;
  }

  get selectedPref(): number[] {
    return RoutingState.currentPref;
  }

  get costTags(): string[] {
    return RoutingState.costTags;
  }

  get prefValid(): boolean {
    const sum = this.selectedPref.reduce((acc, el) => acc + el, 0);
    const allValid = this.selectedPref.every(this.valueInRange);
    return allValid && sum === 1;
  }

  private created() {
    RoutingState.fetchPreference();
  }

  // private fetchPreference() {
  //   RoutingState.fetchPreference();
  // }

  private prefValueValid(value: number) {
    return this.valueInRange(value) || 'Input must be between 0 and 1';
  }

  private valueInRange(value: number) {
    return 0 <= value && value <= 1;
  }

  private async savePreference() {
    await RoutingState.savePreference(this.preferences);
    this.isEditing = false;
  }

  private switchPref(index: number) {
    RoutingState.selectPref(index);
  }

  private async addPreference() {
    await RoutingState.addPreference();
    this.isEditing = true;
  }
}
</script>