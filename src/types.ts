/* tslint:disable */

const colors = ['red', 'orange', 'green', 'blue', 'indigo'];

export interface ICredentials {
  username: string;
  password: string;
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

class PathSplit {
  public cuts: number[] = [];
  public alphas: number[][] = [];
  public dimension_costs: number[][] = [];

  get total_dimension_costs(): number[] {
    if (this.dimension_costs.length === 0) {
      return [];
    }
    return this.dimension_costs.reduce((acc, val) => {
      for (let i = 0; i < acc.length; ++i) {
        acc[i] += val[i];
      }
      return acc;
    });
  }
}

export class Path {
  public id = 0;
  public name = 'New Route';
  public coordinates: ICoordinate[] = [];
  public waypoints: ICoordinate[] = [];
  public user_split: PathSplit = new PathSplit();
  public algo_split: PathSplit | null = null;

  public static fromObject(obj: any) {
    const path = Object.assign(new Path(), obj);
    path.user_split = Object.assign(new PathSplit(), obj.user_split);
    if (obj.algo_split) {
      path.algo_split = Object.assign(new PathSplit(), obj.algo_split);
    }
    return path;
  }

  get subPaths(): [ICoordinate[], string][] {
    if (!this.algo_split) {
      return [];
    }
    const cuts = this.algo_split.cuts;
    if (cuts.length === 0) {
      return [];
    }
    return cuts.map((_, index) => {
      const start = index === 0 ? 0 : cuts[index - 1];
      return [
        this.coordinates.slice(start, cuts[index] + 1),
        colors[index % colors.length],
      ];
    });
  }

  public clear() {
    this.coordinates = [];
    this.waypoints = [];
    this.user_split = new PathSplit();
    this.algo_split = null;
  }

  public clearPath() {
    this.coordinates = [];
  }

  public removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
  }
}
