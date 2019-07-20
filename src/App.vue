<template>
  <div id="app">
    <v-app>
      <router-view />
      <ErrorDialog />
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ErrorDialog from '@/components/ErrorDialog.vue';

@Component({
  name: 'AppComponent',
  components: { ErrorDialog },
})
export default class App extends Vue {}
</script>


<style lang="scss">
#app {
  font-family: 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
