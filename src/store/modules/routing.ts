import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import apiService from '@/api-service';

import store from '../store';
import { ICoordinate, Path } from '@/types';

import ErrorState from './error';
import NotificationState from './notification';

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public loadingPref = false;
  public preference: number[][] = [];
  public prefIndex: number = 0;
  public costTags: string[] = [];
  public userRoutes: Path[] = [new Path()];
  private selectedRouteIdx = 0;

  get currentPref() {
    return this.preference[this.prefIndex];
  }

  get selectedRoute(): Path {
    return this.userRoutes[this.selectedRouteIdx];
  }

  get waypoints(): ICoordinate[] {
    if (!this.selectedRoute) {
      return [];
    }
    return this.selectedRoute.initial_waypoints;
  }

  @Mutation
  public setSelectedRouteIdx(value: number) {
    this.selectedRouteIdx = value;
  }

  @Mutation
  public addRoute() {
    this.userRoutes.push(new Path());
    this.selectedRouteIdx = this.userRoutes.length - 1;
  }

  @Action({ rawError: true })
  public async init() {
    await this.fetchPreference();
    await this.fetchCostTags();
    await this.fetchUserRoutes();
  }

  @Action({ rawError: true })
  public clear() {
    this.selectedRoute.clear();
  }

  @Action({ rawError: true })
  public async addWaypoint(latlng: ICoordinate) {
    const point: ICoordinate = await apiService.fetchClosest(latlng);
    this.waypoints.push(point);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public async addIntermediateWaypoint(latlng: ICoordinate) {
    let closest = {
      dist: Number.MAX_VALUE,
      index: Number.MAX_VALUE,
    };
    this.selectedRoute.coordinates.forEach((point, index) => {
      const dist = Math.sqrt(
        Math.pow(latlng.lat - point.lat, 2) +
          Math.pow(latlng.lng - point.lng, 2)
      );
      if (dist < closest.dist) {
        closest = {
          dist,
          index,
        };
      }
    });
    for (let currentPos = closest.index; currentPos >= 0; currentPos--) {
      const currentCoordinate = this.selectedRoute.coordinates[currentPos];
      const index = this.waypoints.findIndex(
        point =>
          currentCoordinate.lat === point.lat &&
          currentCoordinate.lng === point.lng
      );
      if (index !== -1) {
        this.waypoints.splice(index + 1, 0, latlng);
        break;
      }
    }
  }

  @Action({ rawError: true })
  public removeWaypoint(index: number) {
    this.selectedRoute.removeWaypoint(index);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public async repositionWaypoint({ index, newLoc }: any) {
    this.waypoints.splice(index, 1, newLoc);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public swapWaypoints({ from, to }: any) {
    const temp = this.waypoints[from];
    this.waypoints.splice(from, 1, this.waypoints[to]);
    this.waypoints.splice(to, 1, temp);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public async findNewPreference() {
    this.setLoadingPref(true);
    try {
      const route = await apiService.findPreference(
        this.waypoints,
        this.currentPref
      );
      NotificationState.setMessage('Found Preference');
      this.setRoute(route);
      this.setPreference(route.preference);
    } catch (error) {
      ErrorState.set({
        text: 'An error ocurred while calculating the new preference',
        error,
        callback: this.findNewPreference,
      });
    } finally {
      this.setLoadingPref(false);
    }
  }

  @Action({ rawError: true })
  public async savePreference(preference: number[][]) {
    try {
      await apiService.postPreference(preference);
      this.setPreference(preference);
      this.fetchShortestPath();
    } catch (error) {
      ErrorState.set({
        text: 'Could not save preference',
        error,
        callback: () => this.savePreference(preference),
      });
    }
  }

  @Action({ rawError: true })
  public async fetchPreference() {
    try {
      const preference = await apiService.getPreference();
      this.setPreference(preference);
    } catch (error) {
      ErrorState.set({
        text: 'Could not fetch preference',
        error,
        callback: this.fetchPreference,
      });
    }
  }

  @Action({ rawError: true })
  public async resetData() {
    try {
      await apiService.resetData();
      await this.fetchPreference();
      this.clear();
      this.setPrefIndex(0);
      NotificationState.setMessage('Reset data successfully');
    } catch (error) {
      ErrorState.set({
        text: 'There was an error reseting the user data',
        error,
        callback: this.resetData,
      });
    }
  }

  @Action({ rawError: true })
  public async fetchShortestPath() {
    this.selectedRoute.clearPath();
    if (this.waypoints.length < 2) {
      return;
    }
    try {
      const route = await apiService.shortestPath(
        this.waypoints,
        this.currentPref
      );
      if (!route) {
        NotificationState.setMessage('Could not find a route');
      }
      this.setRoute(route);
    } catch (error) {
      ErrorState.set({
        text: 'There was an error fetching the shortest route',
        error,
        callback: this.fetchShortestPath,
      });
    }
  }

  @Action({ rawError: true })
  public selectPref(index: number) {
    this.setPrefIndex(index);
    // this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public async addPreference() {
    const preference = await apiService.newPreference();
    this.setPreference(preference);
    this.setPrefIndex(this.preference.length - 1);
  }

  @Action({ rawError: true })
  public async fetchUserRoutes() {
    let routes = await apiService.getDrivenRoutes();
    routes = routes.map(route => Path.fromObject(route));
    this.userRoutes.push(...routes);
  }

  @Action({ rawError: true })
  private async fetchCostTags() {
    const tags = await apiService.getCostTags();
    this.setCostTags(tags);
  }

  @Mutation
  private setLoadingPref(value: boolean) {
    this.loadingPref = value;
  }

  @Mutation
  private setCostTags(tags: string[]) {
    this.costTags = tags;
  }

  @Mutation
  private setPreference(pref: number[][]) {
    this.preference = pref;
  }

  @Mutation
  private setPrefIndex(index: number) {
    this.prefIndex = index;
  }

  @Mutation
  private setRoute(route: Path) {
    route = Path.fromObject(route);
    this.userRoutes.splice(this.selectedRouteIdx, 1, route);
  }
}

export default getModule(Routing);
