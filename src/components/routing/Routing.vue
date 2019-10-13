<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="7" lg="8">
        <RoutingMap class="elevation-4" />
      </v-col>
      <v-col>
        <v-card class="fill-height">
          <v-card-title
            >Driven Routes
            <v-spacer></v-spacer>
            <v-btn @click="addRoute" color="green" text icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              @click="showDialog = true"
              :disabled="selected === null || selected === undefined"
              style="color: red"
              text
              icon
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="userRoutes.length === 0" class="text-center">
              <div style="font-weight: bold">No routes to show</div>
              <br />
              Create a new one by clicking on the map
            </div>
            <v-list v-else max-height="500" class="overflow-y-auto" shaped>
              <v-list-item-group v-model="selected" mandatory>
                <v-list-group
                  v-for="(path, index) in userRoutes"
                  :key="index"
                  :value="index === selected"
                >
                  <template v-slot:activator>
                    <v-list-item-title>{{ path.name }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Total Cost:
                      {{ path.costs_by_alpha }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle>
                      {{ new Date() }}
                    </v-list-item-subtitle>
                  </template>
                  <div class="ml-4 mb-10" style="color:black">
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
                            v-for="([_, color],
                            subPathIdx) in selectedRoute.subPaths"
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
                              v-for="(value, index) in selectedRoute.preference[
                                subPathIdx
                              ]"
                              :key="index"
                            >
                              {{ value }} <br />
                              <span class="caption">{{
                                selectedRoute.dim_costs[index]
                              }}</span>
                            </td>
                          </tr>
                          <tr
                            v-if="selectedRoute.dim_costs.length !== 0"
                            style="font-weight:bold"
                          >
                            <td>Total Costs:</td>
                            <td
                              v-for="(cost, index) in selectedRoute.dim_costs"
                              :key="index"
                            >
                              {{ cost }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </v-list-group>
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
          <h2 class="mb-2">Delete Route?</h2>
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
  private selected = null;

  get userRoutes() {
    return RoutingState.userRoutes;
  }

  get costTags() {
    return RoutingState.costTags;
  }

  get selectedRoute() {
    return RoutingState.selectedRoute;
  }

  @Watch('selected')
  private updateSelectedRoute(value: any) {
    RoutingState.setSelectedRouteIdx(value);
  }

  private async created() {
    await RoutingState.init();
  }

  private addRoute() {
    RoutingState.addRoute();
  }

  private reset() {
    this.showDialog = false;
    // RoutingState.resetData();
  }
}
</script>
