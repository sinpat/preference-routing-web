<template>
  <v-card elevation="4">
    <v-card-title class="mb-2">
      My Preference
      <v-spacer></v-spacer>
      <div v-if="!isEditing">
        <v-btn @click="fetchPreference" icon small>
          <v-icon>mdi-replay</v-icon>
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
      <v-row dense>
        <v-col v-for="(_, index) in preference" :key="index" cols="6" sm="4" md="3" lg="2">
          <v-text-field
            v-model.number="preference[index]"
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
    return this.valueInRange(value) || 'Input must be between 0 and 1';
  }

  private valueInRange(value: number) {
    return 0 <= value && value <= 1;
  }

  private savePreference() {
    RoutingState.savePreference(this.preference).then(() => {
      this.isEditing = false;
    });
  }
}
</script>