/* tslint:disable */

export interface ICredentials {
  username: string;
  password: string;
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export class Path {
  public name: string;
  public coordinates: ICoordinate[];
  private splits: number[];
  public preference: number[][] | null;
  public dim_costs: number[];
  public costs_by_alpha: number;
  public initial_waypoints: ICoordinate[];
  public initial_pref: number[];

  constructor() {
    this.name = 'New Route';
    this.coordinates = [];
    this.splits = [];
    this.preference = [];
    this.dim_costs = [];
    this.costs_by_alpha = 0;
    this.initial_waypoints = [];
    this.initial_pref = [];
  }

  get subPaths(): ICoordinate[][] {
    if (this.splits.length === 0) {
      return [];
    }
    return this.splits.map((_, index) => {
      const start = index === 0 ? 0 : this.splits[index - 1];
      return this.coordinates.slice(start, this.splits[index] + 1);
    });
  }

  public clear() {
    this.coordinates = [];
    this.initial_waypoints = [];
  }

  public clearPath() {
    this.coordinates = [];
  }

  public removeWaypoint(index: number) {
    this.initial_waypoints.splice(index, 1);
  }
}
