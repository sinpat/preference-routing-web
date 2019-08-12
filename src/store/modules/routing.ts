import axios from 'axios';
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import store from '../store';
import endpoints from '../endpoints';
import { Coordinate, Path } from '@/types/types';

import ErrorState from '@/store/modules/error';

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public path: Path = {} as Path;
  public waypoints: Coordinate[] = [];
  public preference: number[] = [];

  @Mutation
  public clear() {
    this.path = {} as Path;
    this.waypoints = [];
  }

  @Action({ rawError: true })
  public addWaypoint(latlng: Coordinate) {
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
      this.setPath({} as Path);
    }
  }

  @Action({ rawError: true })
  public moveWaypointUp(index: number) {
    this.waypoints.splice(
      index - 1,
      2,
      this.waypoints[index],
      this.waypoints[index - 1]
    );
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public moveWaypointDown(index: number) {
    this.waypoints.splice(
      index,
      2,
      this.waypoints[index + 1],
      this.waypoints[index]
    );
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public getNewPreference() {
    axios
      .post(endpoints.newPref)
      .then(({ data }) => {
        this.setPreference(data);
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
  public fetchPreference() {
    axios
      .get(endpoints.preference)
      .then(response => {
        this.setPreference(response.data);
      })
      .catch(error => {
        ErrorState.set({
          text: 'Could not fetch preference',
          error,
          callback: this.fetchPreference,
        });
      });
  }

  @Action({ rawError: true })
  public resetData() {
    axios
      .post(endpoints.reset)
      .then(() => alert('Reset data successfully'))
      .catch(error => {
        ErrorState.set({
          text: 'There was an error reseting the user data',
          error,
          callback: this.resetData,
        });
      });
  }

  @Mutation
  private setPreference(pref: number[]) {
    this.preference = pref;
  }

  @Mutation
  private setPath(path: Path) {
    this.path = path;
  }

  @Action({ rawError: true })
  private fetchShortestPath() {
    axios
      .post(endpoints.fsp, this.waypoints)
      .then(({ data }) => {
        this.setPath({
          coordinates: data.path.coordinates,
          costs: data.path.costs,
          totalCost: data.path.total_cost,
          alpha: data.alpha,
          costTags: data.cost_tags,
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
}

function fetchClosest(latlng: Coordinate) {
  return axios.get(endpoints.closest, {
    params: latlng,
  });
}

export default getModule(Routing);
