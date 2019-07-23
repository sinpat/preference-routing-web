export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Path {
  coordinates: Coordinate[];
  costs: number[];
  totalCost: number;
  alpha: number[];
  costTags: number[];
}
