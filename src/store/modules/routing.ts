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
  private source: Coordinate = {} as Coordinate;
  private target: Coordinate = {} as Coordinate;
  private include: Coordinate[] = [];
  private avoid: Coordinate[] = [];

  get Source() {
    if (isSome(this.source)) {
      return this.source;
    }
    return null;
  }
  get Target() {
    if (isSome(this.target)) {
      return this.target;
    }
    return null;
  }

  @Action
  public sourceInput(latlng: Coordinate) {
    this.setSource(latlng);
    axios
      .post(endpoints.setSource, latlng)
      .then(({ data }: any) => {
        this.setSource(data);
        if (isSome(this.target)) {
          this.fetchShortestPath();
        }
      })
      .catch(error => {
        ErrorState.set({ message: error, fun: () => this.sourceInput(latlng) });
      });
  }

  @Action
  public targetInput(latlng: Coordinate) {
    this.setTarget(latlng);
    axios
      .post(endpoints.setTarget, latlng)
      .then(({ data }: any) => {
        this.setTarget(data);
        if (isSome(this.source)) {
          this.fetchShortestPath();
        }
      })
      .catch(error => {
        ErrorState.set({ message: error, fun: () => this.targetInput(latlng) });
      });
  }

  @Action
  public fetchShortestPath() {
    axios
      .post(endpoints.fsp, {
        source: this.source,
        target: this.target,
        include: this.include,
        avoid: this.avoid,
      })
      .then(({ data }) => {
        this.setPath({
          coordinates: data.waypoints,
          costs: data.costs,
          totalCost: data.total_cost,
          alpha: data.alpha,
          costTags: data.cost_tags,
        });
      })
      .catch(error => {
        ErrorState.set({ message: error, fun: this.fetchShortestPath });
      });
  }

  @Mutation
  private setSource(source: Coordinate) {
    this.source = source;
  }

  @Mutation
  private setTarget(target: Coordinate) {
    this.target = target;
  }

  @Mutation
  private setPath(path: Path) {
    this.path = path;
  }
}

function isSome(coord: Coordinate) {
  return coord.lat && coord.lng;
}

export default getModule(Routing);
