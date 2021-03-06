<template>
  <div id="gps-tracker">
    <div v-if="watchId">
      <v-btn @click="stopTracking">Stop Tracking</v-btn>
    </div>
    <div v-else>
      <v-btn @click="startTracking">Start Tracking</v-btn>
    </div>
    <div v-if="gatheredData.length !== 0">
      <v-btn @click="showData = !showData">Show Data</v-btn>
      <div v-if="showData">
        <p v-for="data in readableData" :key="data[0]">{{ data }}</p>
      </div>
      <p v-else>Positions: {{ gatheredData.length }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ErrorState from '@/store/modules/error';

@Component({
  name: 'GPSTrackerComponent',
})
export default class GpsTracker extends Vue {
  private watchId: number = 0;
  private showData: boolean = false;
  private gatheredData: any[] = [];

  get readableData(): any[] {
    return this.gatheredData.map(location => [
      location.timestamp,
      {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    ]);
  }

  private startTracking() {
    this.gatheredData = [];
    if (navigator.geolocation) {
      this.track();
    } else {
      ErrorState.set({
        text: 'Geolocation is not supported by this browser',
      });
    }
  }

  private stopTracking() {
    navigator.geolocation.clearWatch(this.watchId);
    this.watchId = 0;
  }

  private track() {
    this.watchId = navigator.geolocation.watchPosition(
      position => this.gatheredData.push(position),
      error => {
        this.watchId = 0;
        ErrorState.set({
          text: 'There was a problem retrieving the GPS position',
          error,
        });
      },
      { enableHighAccuracy: true }
    );
  }
}
</script>
