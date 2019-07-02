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
  public source: Coordinate = {} as Coordinate;
  public target: Coordinate = {} as Coordinate;
  public path: Coordinate[] = [];

  @Action
  public sourceInput(latlng: Coordinate) {
    this.setSource(latlng);
    axios.post(endpoints.setSource, latlng).then(response => {
      this.setSource(response.data);
      /*
      if (this.target) {
        this.fetchShortestPath();
      }
      */
    });
  }

  @Action
  public targetInput(latlng: Coordinate) {
    this.setTarget(latlng);
    axios.post(endpoints.setTarget, latlng).then(response => {
      this.setTarget(response.data);
      /*
      if (this.source) {
        this.fetchShortestPath();
      }
      */
    });
  }

  @Action
  public fetchShortestPath() {
    axios
      .post(endpoints.fsp, { source: this.source, target: this.target })
      .then(response => {
        this.path = response.data;
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
}

export default getModule(Routing);
