import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';

import apiService from '@/api-service';

import store from '../store';
import { ICoordinate, Path } from '@/types';

import ErrorState from './error';
import NotificationState from './notification';
import PreferenceState from './preference';

@Module({
  dynamic: true,
  name: 'routingState',
  store,
})
class Routing extends VuexModule {
  public loadingPref = false;
  public costTags: string[] = [];
  public userRoutes: Path[] = [];
  public newRoute: Path = new Path();
  public tempPath: ICoordinate[] = []; // used when dragging a marker
  public markerIsDragged = false;
  public selectedRouteIdx = 0;

  get selectedRoute(): Path {
    if (this.selectedRouteIdx === 0) {
      return this.newRoute;
    }
    return this.userRoutes[this.selectedRouteIdx - 1];
  }

  get waypoints(): ICoordinate[] {
    return this.selectedRoute.waypoints;
  }

  @Mutation
  public clearState() {
    this.loadingPref = false;
    this.costTags = [];
    this.userRoutes = [];
    this.newRoute = new Path();
    this.selectedRouteIdx = 0;
  }

  @Mutation
  public setSelectedRouteIdx(value: number) {
    this.selectedRouteIdx = value;
  }

  @Mutation
  public startWaypointDragging() {
    this.markerIsDragged = true;
  }

  @Mutation
  public stopWaypointDragging() {
    this.markerIsDragged = false;
    this.tempPath = [];
  }

  @Action({ rawError: true })
  public async init() {
    await PreferenceState.fetchPreference();
    await this.fetchCostTags();
    await this.fetchUserRoutes();
  }

  @Action({ rawError: true })
  public clear() {
    this.selectedRoute.clear();
  }

  @Action({ rawError: true })
  public copyRoute() {
    const {
      coordinates,
      total_dimension_costs,
      user_split,
      waypoints,
    } = Path.fromObject(this.selectedRoute);

    this.setNewRoute(
      Path.fromObject({
        coordinates,
        total_dimension_costs,
        user_split,
        waypoints,
      } as Path)
    );
    this.setSelectedRouteIdx(0);
  }

  @Action({ rawError: true })
  public async deleteRoute() {
    const routes = await apiService.deleteRoute(this.selectedRoute.id);
    this.setSelectedRouteIdx(0);
    this.setUserRoutes(routes);
  }

  @Action({ rawError: true })
  public async addWaypoint(latlng: ICoordinate) {
    const point: ICoordinate = await apiService.fetchClosest(latlng);
    this.waypoints.push(point);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public addIntermediateWaypoint(latlng: ICoordinate) {
    let closest = {
      dist: Infinity,
      index: Infinity,
    };
    this.selectedRoute.coordinates.forEach((point, index) => {
      const dist = Math.sqrt(
        Math.pow(latlng.lat - point.lat, 2) +
          Math.pow(latlng.lng - point.lng, 2)
      );
      if (dist < closest.dist) {
        closest = {
          dist,
          index,
        };
      }
    });
    for (let currentPos = closest.index; currentPos >= 0; currentPos--) {
      const currentCoordinate = this.selectedRoute.coordinates[currentPos];
      const index = this.waypoints.findIndex(
        point =>
          currentCoordinate.lat === point.lat &&
          currentCoordinate.lng === point.lng
      );
      if (index !== -1) {
        this.waypoints.splice(index + 1, 0, latlng);
        break;
      }
    }
  }

  @Action({ rawError: true })
  public async repositionWaypoint({ index, newLoc }: any) {
    this.waypoints.splice(index, 1, newLoc);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public removeWaypoint(index: number) {
    this.selectedRoute.removeWaypoint(index);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public swapWaypoints({ from, to }: any) {
    const temp = this.waypoints[from];
    this.waypoints.splice(from, 1, this.waypoints[to]);
    this.waypoints.splice(to, 1, temp);
    this.fetchShortestPath();
  }

  @Action({ rawError: true })
  public async findNewPreference() {
    this.setLoadingPref(true);
    const routeId = this.selectedRoute.id;
    try {
      const userRoutes = await apiService.findPreference(
        routeId,
        this.waypoints,
        PreferenceState.currentPref
      );
      NotificationState.setMessage('Found Preference');
      this.setUserRoutes(userRoutes);
      if (routeId === 0) {
        this.setSelectedRouteIdx(this.userRoutes.length);
      }
      this.clearNewRoute();
    } catch (error) {
      ErrorState.set({
        text: 'An error ocurred while calculating the new preference',
        error,
        callback: this.findNewPreference,
      });
    } finally {
      this.setLoadingPref(false);
    }
  }

  @Action({ rawError: true })
  public async resetData() {
    try {
      await apiService.resetData();
      await PreferenceState.fetchPreference();
      await this.fetchUserRoutes();
      this.clear();
      PreferenceState.selectPref(0);
      NotificationState.setMessage('Reset data successfully');
    } catch (error) {
      ErrorState.set({
        text: 'There was an error reseting the user data',
        error,
        callback: this.resetData,
      });
    }
  }

  @Action({ rawError: true })
  public async fetchShortestPath() {
    this.selectedRoute.clearPath();
    if (this.waypoints.length < 2) {
      return;
    }
    try {
      const route = await apiService.shortestPath(
        this.selectedRoute.id,
        this.waypoints,
        PreferenceState.currentPref
      );
      if (!route) {
        NotificationState.setMessage('Could not find a route');
      } else if (this.markerIsDragged) {
        this.setTempPath(route.coordinates);
      } else {
        this.setRoute(route);
      }
    } catch (error) {
      ErrorState.set({
        text: 'There was an error fetching the shortest route',
        error,
        callback: this.fetchShortestPath,
      });
    }
  }

  @Action({ rawError: true })
  public async fetchUserRoutes() {
    const routes = await apiService.getDrivenRoutes();
    this.setUserRoutes(routes);
  }

  @Action({ rawError: true })
  private async fetchCostTags() {
    const tags = await apiService.getCostTags();
    this.setCostTags(tags);
  }

  @Mutation
  private setUserRoutes(routes: Path[]) {
    routes = routes.map(route => Path.fromObject(route));
    this.userRoutes = routes;
  }

  @Mutation
  private setLoadingPref(value: boolean) {
    this.loadingPref = value;
  }

  @Mutation
  private setCostTags(tags: string[]) {
    this.costTags = tags;
  }

  @Mutation
  private setRoute(route: Path) {
    route = Path.fromObject(route);
    if (this.selectedRouteIdx === 0) {
      this.newRoute = route;
    } else {
      this.userRoutes.splice(this.selectedRouteIdx - 1, 1, route);
    }
  }

  @Mutation
  private setTempPath(coordinates: ICoordinate[]) {
    this.tempPath = coordinates;
  }

  @Mutation
  private setNewRoute(route: Path) {
    this.newRoute = route;
  }

  @Mutation
  private clearNewRoute() {
    this.newRoute = new Path();
  }
}

export default getModule(Routing);
