import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import apiService from '@/api-service';

import store from '../store';
import { ICoordinate, IPath } from '@/types/types';

import ErrorState from '@/store/modules/error';
import NotificationState from '@/store/modules/notification';

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public path: IPath = {} as IPath;
  public waypoints: ICoordinate[] = [];
  public preference: number[] = [];
  public costTags: string[] = ['Unsuitability', 'Distance', 'Height'];

  @Mutation
  public clear() {
    this.path = {} as IPath;
    this.waypoints = [];
  }

  @Action({ rawError: true })
  public async addWaypoint(latlng: ICoordinate) {
    try {
      const point = await apiService.fetchClosest(latlng);

      // Find waypoint with smallest distance to input Coordinate
      let minDist = Number.MAX_VALUE;
      let spliceIndex = -1;
      this.waypoints.forEach((current, index) => {
        const dist = Math.sqrt(
          Math.pow(point.lat - current.lat, 2) +
            Math.pow(point.lng - current.lng, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          spliceIndex = index;
        }
      });
      if (spliceIndex === 0) {
        // We do not want to change our source
        spliceIndex++;
      } else if (spliceIndex === -1) {
        // We have no waypoints yet
        spliceIndex = 0;
      }
      this.waypoints.splice(spliceIndex, 0, point);
      this.fetchShortestPath();
    } catch (error) {
      ErrorState.set({
        text: 'Nearest point could not be fetched',
        error,
        callback: () => this.addWaypoint(latlng),
      });
    }
  }

  @Action({ rawError: true })
  public removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
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
    try {
      const newPref = await apiService.findPreference();
      if (newPref.length !== 0) {
        this.setPreference(newPref);
      }
    } catch (error) {
      ErrorState.set({
        text: 'There was an error calculating the new preference',
        error,
        callback: this.findNewPreference,
      });
    }
  }

  @Action({ rawError: true })
  public async savePreference(preference: number[]) {
    try {
      const newPref = await apiService.postPreference(preference);
      this.setPreference(newPref);
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
      await this.fetchShortestPath();
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
    if (this.waypoints.length < 2) {
      return;
    }
    this.setPath({} as IPath);
    try {
      const path = await apiService.shortestPath(this.waypoints);
      this.setPath(path);
    } catch (error) {
      ErrorState.set({
        text: 'There was an error fetching the shortest path',
        error,
        callback: this.fetchShortestPath,
      });
    }
  }

  @Mutation
  private setPreference(pref: number[]) {
    this.preference = pref;
  }

  @Mutation
  private setPath(path: IPath) {
    this.path = path;
  }
}

export default getModule(Routing);
