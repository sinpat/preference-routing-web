<template>
  <div>
    <v-row dense>
      <v-col cols="12" xl="6">
        <RoutingMap class="elevation-4" />
      </v-col>
      <v-col>
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
                    v-for="([_, alpha, color],
                    subPathIdx) in selectedRoute.subPaths"
                    :key="subPathIdx"
                  >
                    <td>
                      <v-card
                        :color="color"
                        height="25px"
                        width="25px"
                      ></v-card>
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
            <v-btn
              @click="showDialog = true"
              :disabled="selectedRouteIdx === 0"
              title="Delete Route"
              text
              icon
            >
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
import { Watch } from 'vue-property-decorator';

import RoutingMap from './map/RoutingMap.vue';
import RoutingPreferenceManager from './RoutingPreferenceManager.vue';

import RoutingState from '@/store/modules/routing';
import PreferenceState from '@/store/modules/preference';

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

  private copyRoute() {
    RoutingState.copyRoute();
  }

  private deleteRoute() {
    this.showDialog = false;
    RoutingState.deleteRoute();
  }

  private addPref(value: number[]) {
    PreferenceState.addPreference(value);
  }

  // private reset() {
  //   this.showDialog = false;
  //   RoutingState.resetData();
  // }
}
</script>
