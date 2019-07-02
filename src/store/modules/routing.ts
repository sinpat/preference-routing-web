import axios from 'axios';
import { Module, VuexModule, Action, getModule } from 'vuex-module-decorators';

import store from '../store';
import endpoints from '../endpoints';
import { Coordinate } from '@/types/types';

@Module({
  dynamic: true,
  namespaced: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public source!: Coordinate;
  public target!: Coordinate;
  public path: Coordinate[] = [];

  @Action
  public setSource(latlng: Coordinate) {
    this.source = latlng;
    axios.post(endpoints.setSource, latlng).then(response => {
      this.source = response.data;
      if (this.target) {
        this.fetchShortestPath();
      }
    });
  }

  @Action
  public setTarget(latlng: Coordinate) {
    this.target = latlng;
    axios.post(endpoints.setTarget, latlng).then(response => {
      this.target = response.data;
      if (this.source) {
        this.fetchShortestPath();
      }
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
}

export default getModule(Routing);
