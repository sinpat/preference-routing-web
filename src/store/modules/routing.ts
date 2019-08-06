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

  @Mutation
  public clear() {
    this.path = {} as Path;
    this.waypoints = [];
  }

  @Action
  public addWaypoint(latlng: Coordinate) {
    this.fetchClosest(latlng)
      .then((point: any) => {
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
          message: error,
          fun: () => this.addWaypoint(latlng),
        });
      });
  }

  @Action
  public removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
    if (this.waypoints.length >= 2) {
      this.fetchShortestPath();
    } else {
      this.setPath({} as Path);
    }
  }

  @Action
  public moveWaypointUp(index: number) {
    this.waypoints.splice(
      index - 1,
      2,
      this.waypoints[index],
      this.waypoints[index - 1]
    );
    this.fetchShortestPath();
  }

  @Action
  public moveWaypointDown(index: number) {
    this.waypoints.splice(
      index,
      2,
      this.waypoints[index + 1],
      this.waypoints[index]
    );
    this.fetchShortestPath();
  }

  @Action
  public getNewPreference() {
    axios
      .post(endpoints.newPref)
      .then(({ data }) => {
        console.log('New Preference:', data);
      })
      .catch(error => {
        ErrorState.set({
          message: error,
          fun: this.getNewPreference,
        });
      });
  }

  @Mutation
  private setPath(path: Path) {
    this.path = path;
  }

  @Action
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
          message: error,
          fun: this.fetchShortestPath,
        });
      });
  }

  @Action
  private fetchClosest(latlng: Coordinate) {
    return new Promise((resolve, reject) => {
      axios
        .get(endpoints.closest, {
          params: latlng,
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
}

export default getModule(Routing);
