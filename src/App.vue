<template>
  <div id="app">
    <v-app>
      <router-view />
      <ErrorDialog />
      <Snackbar />
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ErrorDialog from '@/components/util/ErrorDialog.vue';
import Snackbar from '@/components/util/Snackbar.vue';

@Component({
  name: 'App',
  components: { ErrorDialog, Snackbar },
})
export default class App extends Vue {}
</script>


<style lang="scss">
#app {
  font-family: 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
