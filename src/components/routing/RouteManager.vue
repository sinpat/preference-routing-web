<template>
  <div class="overflow-y-auto route-manager">
    <v-expansion-panels
      @change="selectionChange"
      :value="selectedRouteIdx"
      accordion
      mandatory
    >
      <v-expansion-panel
        v-for="(path, index) in [newRoute, ...userRoutes]"
        :key="index"
        class="elevation-4"
      >
        <v-expansion-panel-header>
          <span
            class="route-title"
            :style="selectedRouteIdx === index ? 'font-size: 1.5rem' : ''"
            >{{ path.name }}</span
          >
          <div
            v-if="selectedRouteIdx === index && selectedRouteIdx !== 0"
            class="text-right mr-2"
          >
            <v-btn
              @click.stop="copyRoute"
              title="Copy waypoints to new route"
              text
              icon
              small
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn
              @click.stop="showDialog = true"
              :disabled="selectedRouteIdx === 0"
              title="Delete Route"
              text
              icon
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Color</th>
                  <th v-for="tag in costTags" :key="tag">
                    {{ tag }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="([_, alpha, color],
                  subPathIdx) in selectedRoute.subPaths"
                  :key="subPathIdx"
                >
                  <td>
                    <v-card :color="color" height="25px" width="25px"></v-card>
                  </td>
                  <td v-for="(value, index) in alpha" :key="index">
                    {{ value }}
                  </td>
                  <td>
                    <v-btn
                      @click="addPref(alpha)"
                      title="Add to Preferences"
                      text
                      icon
                      small
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </td>
                </tr>

                <tr
                  v-if="selectedRoute.total_dimension_costs.length !== 0"
                  style="font-weight:bold"
                >
                  <td>Total Costs:</td>
                  <td
                    v-for="(cost, index) in selectedRoute.total_dimension_costs"
                    :key="index"
                  >
                    {{ cost }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog :value="showDialog" width="400" persistent>
      <v-card>
        <v-card-title class="warning" primary-title>
          <v-icon class="mr-2">mdi-alert</v-icon>Warning
        </v-card-title>
        <v-card-text class="mt-6 mb-2">
          <h2 class="mb-2">Delete Route?</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteRoute" class="warning">
            <v-icon left>mdi-delete</v-icon>
            Delete</v-btn
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
import PreferenceState from '@/store/modules/preference';

@Component
export default class RouteManager extends Vue {
  private showDialog = false;

  get userRoutes() {
    return RoutingState.userRoutes;
  }

  get newRoute() {
    return RoutingState.newRoute;
  }

  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  get selectedRouteIdx() {
    return RoutingState.selectedRouteIdx;
  }

  get costTags() {
    return RoutingState.costTags;
  }

  private copyRoute() {
    RoutingState.copyRoute();
  }

  private selectionChange(value: number) {
    RoutingState.setSelectedRouteIdx(value);
  }

  private addPref(value: number[]) {
    PreferenceState.addPreference(value);
  }

  private deleteRoute() {
    this.showDialog = false;
    RoutingState.deleteRoute();
  }
}
</script>

<style scoped>
.route-manager {
  max-height: 600px;
}
.route-title {
  font-size: 1.25rem;
}
</style>