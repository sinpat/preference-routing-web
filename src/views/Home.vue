<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="logout">Logout</button>
    <Map />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Map from '@/components/Map.vue';
import userState from '@/store/modules/user';

@Component({
  components: { Map },
  name: 'HomeScreen',
})
export default class Home extends Vue {
  private logout() {
    userState.logout();
    this.$router.push({ name: 'login' });
  }
}
</script>
