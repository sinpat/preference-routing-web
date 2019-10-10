import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import apiService from '@/api-service';

import store from '../store';
import { ICoordinate, IPath } from '@/types';

import ErrorState from './error';
import NotificationState from './notification';
import ConfigState from './config';

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public path: IPath | null = null;
  public selectedRouteIdx = -1;
  public waypoints: ICoordinate[] = [];
  public preference: number[][] = [];
  public prefIndex: number = 0;
  public costTags: string[] = [];
  public userRoutes: IPath[] = [];

  get currentPref() {
    return this.preference[this.prefIndex];
  }

  get selectedRoute() {
    if (this.selectedRouteIdx === -1) {
      return null;
    }
    return this.userRoutes[this.selectedRouteIdx];
  }

  @Mutation
  public setSelectedRouteIdx(value: number) {
    this.selectedRouteIdx = value;
  }

  @Mutation
  public clear() {
    this.path = null;
    this.waypoints = [];
  }

  @Action({ rawError: true })
  public async init() {
    await this.fetchPreference();
    await this.fetchCostTags();
    await this.fetchUserRoutes();
  }

  @Action({ rawError: true })
  public async addWaypoint(latlng: ICoordinate) {
    const point: ICoordinate = await apiService.fetchClosest(latlng);
    const insertionOrder = ConfigState.insertionOrder;
    if (insertionOrder === 'in_order') {
      this.waypoints.push(point);
    } else if (insertionOrder === 'intermediate') {
      // Find waypoint with smallest distance to input Coordinate
      // let minDist = Number.MAX_VALUE;
      // let spliceIndex = -1;
      // this.waypoints.forEach((current, index) => {
      //   const dist = Math.sqrt(
      //     Math.pow(point.lat - current.lat, 2) +
      //       Math.pow(point.lng - current.lng, 2)
      //   );
      //   if (dist < minDist) {
      //     minDist = dist;
      //     spliceIndex = index;
      //   }
      // });
      // if (spliceIndex === 0) {
      //   // We do not want to change our source
      //   spliceIndex++;
      // } else if (spliceIndex === -1) {
      //   // We have no waypoints yet
      //   spliceIndex = 0;
      // }
      // this.waypoints.splice(spliceIndex, 0, point);
      if (this.waypoints.length < 2) {
        this.waypoints.push(point);
      } else {
        this.waypoints.splice(this.waypoints.length - 1, 0, point);
      }
    }
  }

  @Action({ rawError: true })
  public removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
  }

  @Action({ rawError: true })
  public async repositionWaypoint({ index, newLoc }: any) {
    const point = await apiService.fetchClosest(newLoc);
    this.waypoints.splice(index, 1, point);
  }

  @Action({ rawError: true })
  public swapWaypoints({ from, to }: any) {
    const temp = this.waypoints[from];
    this.waypoints.splice(from, 1, this.waypoints[to]);
    this.waypoints.splice(to, 1, temp);
  }

  @Action({ rawError: true })
  public async findNewPreference() {
    const prefIndex = this.prefIndex;
    try {
      const [preference, splits] = await apiService.findPreference(
        prefIndex,
        this.waypoints,
        this.currentPref
      );
      NotificationState.setMessage('Found Preference');
      this.setPreference(preference);
      this.fetchUserRoutes();
    } catch (error) {
      ErrorState.set({
        text: 'An error ocurred while calculating the new preference',
        error,
        callback: this.findNewPreference,
      });
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
    this.clearPath();
    if (this.waypoints.length < 2) {
      return;
    }
    try {
      const path = await apiService.shortestPath(
        this.waypoints,
        this.currentPref
      );
      if (!path) {
        NotificationState.setMessage('Could not find a path');
      }
      this.setPath(path);
    } catch (error) {
      ErrorState.set({
        text: 'There was an error fetching the shortest path',
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
    const routes = await apiService.getDrivenRoutes();
    this.setUserRoutes(routes);
  }

  @Action({ rawError: true })
  private async fetchCostTags() {
    const tags = await apiService.getCostTags();
    this.setCostTags(tags);
  }

  @Mutation
  private setUserRoutes(routes: IPath[]) {
    this.userRoutes = routes;
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
  private setPath(path: IPath) {
    this.path = path;
  }

  @Mutation
  private clearPath() {
    this.path = null;
  }
}

export default getModule(Routing);
