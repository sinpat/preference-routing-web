<template>
  <div id="app">
    <v-app>
      <!-- Toolbar -->
      <v-app-bar app clipped-left>
        <v-toolbar-title class="headline text-uppercase">
          <span>Preference Routing</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="$route.name === 'home'"
          @click="logout"
          title="Logout"
          rounded
          text
          icon
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <v-btn
          v-else-if="$route.name === 'login'"
          @click="$router.push({ name: 'register' })"
          text
          rounded
        >
          Register
        </v-btn>
        <v-btn
          v-else-if="$route.name === 'register'"
          @click="$router.push({ name: 'login' })"
          text
          rounded
        >
          Log In
        </v-btn>
      </v-app-bar>

      <!-- Main content -->
      <v-content class="mx-2">
        <!-- <v-container> -->
        <router-view />
        <!-- </v-container> -->
      </v-content>

      <!-- Footer -->
      <v-footer>
        <span>&copy; Patrick Singer 2019</span>
      </v-footer>
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
import RoutingState from '@/store/modules/routing';
import UserState from '@/store/modules/user';
import PreferenceState from '@/store/modules/preference';

@Component({
  name: 'App',
  components: { ErrorDialog, Snackbar },
})
export default class App extends Vue {
  private logout() {
    RoutingState.clearState();
    PreferenceState.clearState();
    UserState.logout();
    this.$router.push({ name: 'login' });
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
