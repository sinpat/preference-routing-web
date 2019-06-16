<template>
  <div class="home">
    <h1>Home</h1>
    <Map/>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Map from '@/components/Map.vue';

@Component({
  components: {
    Map,
  },
})
export default class Home extends Vue {
  private logout() {
    this.$store.dispatch('logout');
    this.$router.push({ name: 'login' });
  }
}
</script>
