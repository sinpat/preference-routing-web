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

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public path: Coordinate[] = [];
  private source: Coordinate = {} as Coordinate;
  private target: Coordinate = {} as Coordinate;

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
    axios.post(endpoints.setSource, latlng).then(response => {
      this.setSource(response.data);
      if (isSome(this.target)) {
        this.fetchShortestPath();
      }
    });
  }

  @Action
  public targetInput(latlng: Coordinate) {
    this.setTarget(latlng);
    axios.post(endpoints.setTarget, latlng).then(response => {
      this.setTarget(response.data);
      if (isSome(this.source)) {
        this.fetchShortestPath();
      }
    });
  }

  @Action
  public fetchShortestPath() {
    axios
      .post(endpoints.fsp, { source: this.source, target: this.target })
      .then(response => {
        this.setPath(response.data);
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
  private setPath(path: Coordinate[]) {
    this.path = path;
  }
}

function isSome(coord: Coordinate) {
  return coord.lat && coord.lng;
}

export default getModule(Routing);
