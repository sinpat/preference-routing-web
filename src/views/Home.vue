<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="logout">Logout</button>
    <Map/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Map from '@/components/Map.vue';

export default Vue.extend({
  name: 'Home',
  components: { Map },

  methods: {
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push({ name: 'login' });
    },
  },
});
</script>
