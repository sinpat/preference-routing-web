<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';

@Component
export default class Home extends Vue {
  private logout() {
    this.$store.dispatch('logout');
    this.$router.push({ name: 'login' });
  }
}
</script>
