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
    if (this.waypoints.length < 2) {
      this.waypoints.push(latlng);
    } else {
      // Find waypoint with smallest distance to input Coordinate
      let minDist = Number.MAX_VALUE;
      let spliceIndex = -1;
      this.waypoints.forEach((current, index) => {
        const dist = Math.sqrt(
          Math.pow(latlng.lat - current.lat, 2) +
            Math.pow(latlng.lng - current.lng, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          spliceIndex = index;
        }
      });
      // We do not want the point to be the new source
      spliceIndex = Math.max(1, spliceIndex);
      this.waypoints.splice(spliceIndex, 0, latlng);
    }
    if (this.waypoints.length >= 2) {
      this.fetchShortestPath();
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

  @Mutation
  private setPath(path: Path) {
    this.path = path;
  }

  @Action
  private fetchShortestPath() {
    axios
      .post(endpoints.fsp, { include: this.waypoints })
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
          fun: () => this.fetchShortestPath(),
        });
      });
  }

  @Action
  private fetchClosest(latlng: Coordinate) {
    return new Promise((resolve, reject) => {
      axios
        .post(endpoints.closest, latlng)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
}

export default getModule(Routing);
