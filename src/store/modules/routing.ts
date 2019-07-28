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
  public paths: Path[] = [];
  public waypoints: Coordinate[] = [];
  public avoid: Coordinate[] = [];

  @Action
  public avoidPoint(latlng: Coordinate) {
    this.fetchClosest(latlng)
      .then((closest: any) => {
        this.avoid.push(closest);
        if (this.waypoints.length >= 2) {
          this.fetchShortestPath();
        }
      })
      .catch(error => {
        ErrorState.set({ message: error, fun: () => this.avoidPoint(latlng) });
      });
  }

  @Action
  public addWaypoint(latlng: Coordinate) {
    this.fetchClosest(latlng)
      .then((closest: any) => {
        this.waypoints.push(closest);
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
  public fetchShortestPath() {
    axios
      .post(endpoints.fsp, {
        way_points: this.waypoints,
        avoid: this.avoid,
      })
      .then(({ data }) => {
        const paths: Path[] = data.dijkstra_results.map((result: any) => {
          return {
            coordinates: result.path.map((el: any) => {
              return el.location;
            }),
            costs: result.costs,
            totalCost: result.total_cost,
            alpha: data.alpha,
            costTags: data.costTags,
          };
        });
        this.setPaths(paths);
      })
      .catch(error => {
        ErrorState.set({ message: error, fun: this.fetchShortestPath });
      });
  }

  @Mutation
  private setPaths(paths: Path[]) {
    this.paths = paths;
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
