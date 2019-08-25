<template>
  <div class="home">
    <v-tabs slider-color="blue" icons-and-text dark fixed-tabs>
      <v-tab>
        Routing
        <v-icon>mdi-navigation</v-icon>
      </v-tab>
      <v-tab>
        GPS Tracker
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-tab>
      <v-tab-item class="mx-2">
        <Routing />
      </v-tab-item>
      <v-tab-item class="mx-2">
        <GpsTracker />
      </v-tab-item>
    </v-tabs>
    <div class="mx-4 my-4 text-center">
      <v-btn @click="logout">Logout</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import UserState from '@/store/modules/user';

import Routing from '@/components/routing/Routing.vue';
import GpsTracker from '@/components/GpsTracker.vue';

@Component({
  components: { GpsTracker, Routing },
  name: 'HomeView',
})
export default class Home extends Vue {
  private logout() {
    UserState.logout();
    this.$router.push({ name: 'login' });
  }
}
</script>
