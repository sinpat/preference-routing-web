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
}

export class Path {
  public id = 0;
  public coordinates: ICoordinate[] = [];
  public waypoints: ICoordinate[] = [];
  public user_split: PathSplit = new PathSplit();
  public algo_split: PathSplit | null = null;
  public total_dimension_costs: number[] = [];

  public static fromObject(obj: Path) {
    const path = Object.assign(new Path(), obj);
    path.user_split = Object.assign(new PathSplit(), obj.user_split);
    if (obj.algo_split) {
      path.algo_split = Object.assign(new PathSplit(), obj.algo_split);
    }
    return path;
  }

  get name(): string {
    if (this.id === 0) {
      return 'New Route';
    }
    return `Route ${this.id}`;
  }

  get subPaths(): [ICoordinate[], number[], string][] {
    const algo_split = this.algo_split;
    if (!algo_split) {
      return [];
    }
    const cuts = algo_split.cuts;
    if (cuts.length === 0) {
      return [];
    }
    return algo_split.alphas.map((alpha, index) => {
      const start = index === 0 ? 0 : cuts[index - 1];
      return [
        this.coordinates.slice(start, cuts[index] + 1),
        alpha,
        colors[index % colors.length],
      ];
    });
  }

  public clear() {
    this.coordinates = [];
    this.waypoints = [];
    this.total_dimension_costs = [];
    this.user_split = new PathSplit();
    this.algo_split = null;
  }

  public clearPath() {
    this.coordinates = [];
  }

  public removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
    if (this.waypoints.length < 2) {
      this.total_dimension_costs = [];
      this.algo_split = null;
    }
  }
}
