import axios from 'axios';
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import apiService from '@/api-service';

import store from '../store';
import endpoints from '@/endpoints';
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
  public addWaypoint(latlng: ICoordinate) {
    fetchClosest(latlng)
      .then(({ data: point }) => {
        if (this.waypoints.length < 2) {
          this.waypoints.push(point);
        } else {
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
          }
          this.waypoints.splice(spliceIndex, 0, point);
        }
        if (this.waypoints.length >= 2) {
          this.fetchShortestPath();
        }
      })
      .catch(error => {
        ErrorState.set({
          text: 'Nearest point could not be fetched',
          error,
          callback: () => this.addWaypoint(latlng),
        });
      });
  }

  @Action({ rawError: true })
  public removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
    if (this.waypoints.length >= 2) {
      this.fetchShortestPath();
    } else {
      this.setPath({} as IPath);
    }
  }

  @Action({ rawError: true })
  public swapWaypoints({ from, to }: any) {
    const temp = this.waypoints[from];
    this.waypoints.splice(from, 1, this.waypoints[to]);
    this.waypoints.splice(to, 1, temp);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public getNewPreference() {
    axios
      .post(endpoints.calcPref)
      .then(({ data }) => {
        if (data.length !== 0) {
          this.setPreference(data);
        }
      })
      .catch(error => {
        ErrorState.set({
          text: 'There was an error calculating the new preference',
          error,
          callback: this.getNewPreference,
        });
      });
  }

  @Action({ rawError: true })
  public savePreference(preference: number[]) {
    return new Promise((resolve, reject) => {
      axios
        .post(endpoints.preference, preference)
        .then(response => {
          this.setPreference(response.data);
          resolve();
        })
        .catch(error => {
          ErrorState.set({
            text: 'Could not save preference',
            error,
            callback: () => this.savePreference(preference),
          });
          reject();
        });
    });
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
  public resetData() {
    axios
      .post(endpoints.reset)
      .then(() => {
        this.fetchPreference();
        NotificationState.setMessage('Reset data successfully');
      })
      .catch(error => {
        ErrorState.set({
          text: 'There was an error reseting the user data',
          error,
          callback: this.resetData,
        });
      });
  }

  @Action({ rawError: true })
  public fetchShortestPath() {
    axios
      .post(endpoints.fsp, this.waypoints)
      .then(({ data }) => {
        this.setPath({
          coordinates: data.coordinates,
          costs: data.costs,
          totalCost: data.total_cost,
          alpha: data.alpha,
        });
      })
      .catch(error => {
        ErrorState.set({
          text: 'There was an error fetching the shortest path',
          error,
          callback: this.fetchShortestPath,
        });
      });
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

function fetchClosest(latlng: ICoordinate) {
  return axios.get(endpoints.closest, {
    params: latlng,
  });
}

export default getModule(Routing);
