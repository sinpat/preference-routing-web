<template>
  <v-card v-if="costTags.length">
    <v-card-title>
      My Preferences
      <v-spacer></v-spacer>
      <div v-if="!isEditing">
        <v-btn icon small>
          <v-icon @click="addPreference" title="Add Preference"
            >mdi-plus</v-icon
          >
        </v-btn>
        <v-btn @click="isEditing = true" title="Edit Preferences" icon small>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <v-btn
        v-else
        @click="savePreference"
        :disabled="!prefValid"
        title="Save Preferences"
        icon
        small
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn
        @click="deletePreference"
        :disabled="preferences.length <= 1"
        title="Delete selected Preference"
        icon
        small
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="pb-0">
      <v-btn-toggle @change="switchPref" :value="prefIndex" mandatory>
        <v-btn v-for="(alpha, index) in preferences" :key="index">
          {{ index + 1 }}
        </v-btn>
      </v-btn-toggle>
      <v-row class="mt-4" dense>
        <v-col
          v-for="(tag, index) in costTags"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <v-text-field
            v-model.number="selectedPref[index]"
            :readonly="!isEditing"
            :rules="[prefValueValid]"
            :label="tag"
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
import PreferenceState from '@/store/modules/preference';

@Component({
  name: 'PreferenceManagerComponent',
})
export default class RoutingPreferenceManager extends Vue {
  private isEditing = false;

  get preferences(): number[][] {
    return PreferenceState.preference;
  }

  get prefIndex(): number {
    return PreferenceState.prefIndex;
  }

  get selectedPref(): number[] {
    return PreferenceState.currentPref;
  }

  get costTags(): string[] {
    return RoutingState.costTags;
  }

  get prefValid(): boolean {
    const sum = this.selectedPref.reduce((acc, el) => acc + el, 0);
    const allValid = this.selectedPref.every(this.valueInRange);
    return allValid && sum === 1;
  }

  private prefValueValid(value: number) {
    return this.valueInRange(value) || 'Input must be between 0 and 1';
  }

  private valueInRange(value: number) {
    return 0 <= value && value <= 1;
  }

  private switchPref(index: number) {
    PreferenceState.selectPref(index);
    RoutingState.fetchShortestPath();
  }

  private async savePreference() {
    await PreferenceState.savePreference(this.preferences);
    this.isEditing = false;
    RoutingState.fetchShortestPath();
  }

  private async addPreference() {
    await PreferenceState.newPreference();
    this.isEditing = true;
  }

  private async deletePreference() {
    await PreferenceState.deletePreference();
    this.isEditing = false;
    RoutingState.fetchShortestPath();
  }
}
</script>
