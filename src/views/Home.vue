<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="logout">Logout</button>
    <Map/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Map from '@/components/Map.vue';

@Component({
  components: { Map },
})
export default class Home extends Vue {
  private name: string = 'Home';

  private logout() {
    this.$store.dispatch('user/logout');
    this.$router.push({ name: 'login' });
  }
}
</script>
