<template>
  <div>
    <v-row>
      <v-col cols="6" style="font-size: 1.1rem">
        <span>Show all driven routes</span>
      </v-col>
      <v-col cols="6"
        ><v-switch @change="setShowAll" :value="showAll" class="ma-0"></v-switch
      ></v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="showDialog = true" style="color: red">Reset Data</v-btn>
      </v-col>
    </v-row>

    <v-dialog :value="showDialog" width="400" persistent>
      <v-card>
        <v-card-title class="warning" primary-title>
          <v-icon class="mr-2">mdi-alert</v-icon>Warning
        </v-card-title>
        <v-card-text class="mt-6 mb-2">
          <h2 class="mb-2">Reset Data?</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="reset" class="warning">
            <v-icon left>mdi-delete</v-icon>
            Reset</v-btn
          >
          <v-btn @click="showDialog = false">
            <v-icon left>mdi-close</v-icon>Close
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

@Component({
  name: 'RoutingControlsComponent',
})
export default class RoutingControls extends Vue {
  private showDialog = false;

  get showAll() {
    return RoutingState.showAll;
  }

  private setShowAll(value: boolean) {
    RoutingState.setShowAll(value);
  }

  private reset() {
    this.showDialog = false;
    RoutingState.resetData();
  }
}
</script>