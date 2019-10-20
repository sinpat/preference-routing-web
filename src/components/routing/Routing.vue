<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="8" lg="7">
        <RoutingMap class="elevation-4" />
      </v-col>
      <v-col>
        <v-card height="600px" style="overflow-y:auto">
          <v-card-title>{{ selectedRoute.name }}</v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="tag in costTags" :key="tag">
                      {{ tag }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="([_, color], subPathIdx) in selectedRoute.subPaths"
                    :key="subPathIdx"
                  >
                    <td>
                      <v-card
                        height="25px"
                        width="25px"
                        :color="color"
                      ></v-card>
                    </td>
                    <td
                      v-for="(value, index) in selectedRoute.algo_split.alphas[
                        subPathIdx
                      ]"
                      :key="index"
                    >
                      {{ value }}
                    </td>
                  </tr>

                  <tr
                    v-if="selectedRoute.total_dimension_costs.length !== 0"
                    style="font-weight:bold"
                  >
                    <td>Total Costs:</td>
                    <td
                      v-for="(cost,
                      index) in selectedRoute.total_dimension_costs"
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
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >Driven Routes
            <v-spacer></v-spacer>
            <v-btn @click="showDialog = true" style="color: red" text icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list max-height="500" class="overflow-y-auto" rounded>
              <v-list-item-group
                :value="selectedRouteIdx"
                @change="selectionChange"
                mandatory
              >
                <v-list-item>
                  <v-list-item-title>{{ newRoute.name }}</v-list-item-title>
                </v-list-item>
                <v-list-item v-for="(path, index) in userRoutes" :key="index">
                  <v-list-item-title>{{ path.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ new Date() }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <RoutingPreferenceManager class="elevation-4" />
      </v-col>
    </v-row>
    <v-dialog :value="showDialog" width="400" persistent>
      <v-card>
        <v-card-title class="warning" primary-title>
          <v-icon class="mr-2">mdi-alert</v-icon>Warning
        </v-card-title>
        <v-card-text class="mt-6 mb-2">
          <h2 class="mb-2">Reset routes and preferences?</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="reset" class="warning">
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
import { Watch } from 'vue-property-decorator';

import RoutingMap from './RoutingMap.vue';
import RoutingPreferenceManager from './RoutingPreferenceManager.vue';

import RoutingState from '@/store/modules/routing';

import apiService from '@/api-service';

@Component({
  name: 'RoutingComponent',
  components: {
    RoutingMap,
    RoutingPreferenceManager,
  },
})
export default class Routing extends Vue {
  private showDialog = false;

  get userRoutes() {
    return RoutingState.userRoutes;
  }

  get newRoute() {
    return RoutingState.newRoute;
  }

  get costTags() {
    return RoutingState.costTags;
  }

  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  get selectedRouteIdx() {
    return RoutingState.selectedRouteIdx;
  }

  private async created() {
    await RoutingState.init();
  }

  private selectionChange(value: number) {
    RoutingState.setSelectedRouteIdx(value);
  }

  private reset() {
    this.showDialog = false;
    RoutingState.resetData();
  }
}
</script>
