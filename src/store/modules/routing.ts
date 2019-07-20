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
import { Coordinate } from '@/types/types';

import ErrorState from '@/store/modules/error';

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public path: Coordinate[] = [];
  public pathCost: number = -1;
  private source: Coordinate = {} as Coordinate;
  private sourceId: number = -1;
  private target: Coordinate = {} as Coordinate;
  private targetId: number = -1;

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
    this.setSource({ source: latlng, nodeId: -1 });
    axios
      .post(endpoints.setSource, latlng)
      .then(({ data }: any) => {
        this.setSource({ source: data.location, nodeId: data.node_id });
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
    this.setTarget({ target: latlng, nodeId: -1 });
    axios
      .post(endpoints.setTarget, latlng)
      .then(({ data }: any) => {
        this.setTarget({ target: data.location, nodeId: data.node_id });
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
      .post(endpoints.fsp, { source: this.sourceId, target: this.targetId })
      .then(response => {
        this.setPath(response.data.path);
        this.setPathCost(response.data.cost);
      })
      .catch(error => {
        ErrorState.set({ message: error, fun: this.fetchShortestPath });
      });
  }

  @Mutation
  private setSource({ source, nodeId }: any) {
    this.source = source;
    this.sourceId = nodeId;
  }

  @Mutation
  private setTarget({ target, nodeId }: any) {
    this.target = target;
    this.targetId = nodeId;
  }

  @Mutation
  private setPath(path: Coordinate[]) {
    this.path = path;
  }

  @Mutation
  private setPathCost(cost: number) {
    this.pathCost = cost;
  }
}

function isSome(coord: Coordinate) {
  return coord.lat && coord.lng;
}

export default getModule(Routing);
