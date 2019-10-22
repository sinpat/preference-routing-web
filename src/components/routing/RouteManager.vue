<template>
  <v-card height="100%" max-height="600" class="overflow-y-auto">
    <v-card-title
      >{{ selectedRoute.name }}
      <v-spacer></v-spacer>
      <v-btn
        v-if="selectedRouteIdx !== 0"
        @click="copyRoute"
        title="Copy waypoints to new route"
        text
        icon
        small
      >
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
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
              v-for="([_, alpha, color], subPathIdx) in selectedRoute.subPaths"
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RoutingState from '@/store/modules/routing';

@Component
export default class RouteManager extends Vue {
  get costTags() {
    return RoutingState.costTags;
  }

  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  get selectedRouteIdx() {
    return RoutingState.selectedRouteIdx;
  }

  private copyRoute() {
    RoutingState.copyRoute();
  }
}
</script>

<style scoped>
</style>