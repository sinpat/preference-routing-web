export interface ICredentials {
  username: string;
  password: string;
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IPath {
  coordinates: ICoordinate[];
  costs: number[];
  total_cost: number;
  alpha: number[];
}
