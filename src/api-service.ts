import axios from 'axios';
import { ICoordinate, Path, ICredentials } from './types';

const endpoint = 'http://localhost:8000/';
const prefEndpoint = endpoint + 'preference';

// const routing = 'http://algohol03.informatik.uni-stuttgart.de:8000/routing/';
// const user = 'http://algohol03.informatik.uni-stuttgart.de:8000/user/';

interface IRequestConfig {
  url: string;
  method: any;
  params?: any;
  data?: any;
}

class ApiService {
  // User related
  public login(credentials: ICredentials) {
    return this.post(endpoint + 'login', credentials);
  }

  public register(credentials: ICredentials) {
    return this.post(endpoint + 'register', credentials);
  }

  // Routing related
  public getCostTags() {
    return this.get<string[]>(endpoint + 'tags');
  }

  public getPreference() {
    return this.get<number[][]>(prefEndpoint);
  }

  public getDrivenRoutes() {
    return this.get<Path[]>(endpoint + 'routes');
  }

  public fetchClosest(latlng: ICoordinate) {
    return this.get<ICoordinate>(endpoint + 'closest', latlng);
  }

  public postPreference(preference: number[][]) {
    return this.post(prefEndpoint, preference);
  }

  public newPreference() {
    return this.post(prefEndpoint + '/new');
  }

  public findPreference(waypoints: ICoordinate[], alpha: number[]) {
    return this.post(prefEndpoint + '/find', { waypoints, alpha });
  }

  public shortestPath(waypoints: ICoordinate[], alpha: number[]) {
    return this.post<Path>(endpoint + 'fsp', {
      waypoints,
      alpha,
    });
  }

  public resetData() {
    return this.post(endpoint + 'reset');
  }

  private get<T>(url: string, params?: any) {
    return this.apiCall<T>({ url, method: 'get', params });
  }

  private post<T = any>(url: string, data?: any) {
    return this.apiCall<T>({ url, method: 'post', data });
  }

  private async apiCall<T>({
    url,
    method,
    params,
    data,
  }: IRequestConfig): Promise<T> {
    const response = await axios({
      url,
      method,
      headers: {
        // tslint:disable-next-line
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      params,
      data,
    });
    return response.data;
  }
}

export default new ApiService();
