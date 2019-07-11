<template>
  <div class="home">
    <v-tabs slider-color="blue" icons-and-text dark fixed-tabs>
      <v-tab>
        Routing
        <v-icon>navigation</v-icon>
      </v-tab>
      <v-tab>
        GPS Tracker
        <v-icon>my_location</v-icon>
      </v-tab>
      <v-tab-item>
        <Map />
      </v-tab-item>
      <v-tab-item>
        <GPSTracker />
      </v-tab-item>
    </v-tabs>
    <br />
    <hr />
    <v-btn @click="logout">Logout</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Map from '@/components/Map.vue';
import GPSTracker from '@/components/GPSTracker.vue';
import userState from '@/store/modules/user';

@Component({
  components: { GPSTracker, Map },
  name: 'HomeScreen',
})
export default class Home extends Vue {
  private logout() {
    userState.logout();
    this.$router.push({ name: 'login' });
  }
}
</script>
