export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IPath {
  coordinates: ICoordinate[];
  costs: number[];
  totalCost: number;
  alpha: number[];
}
