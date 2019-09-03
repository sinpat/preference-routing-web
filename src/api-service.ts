import axios from 'axios';
import { ICoordinate, IPath, ICredentials } from './types/types';

const routing = 'http://localhost:8000/routing/';
const user = 'http://localhost:8000/user/';

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
    return this.post(user + 'login', credentials);
  }

  public register(credentials: ICredentials) {
    return this.post(user + 'register', credentials);
  }

  // Routing related
  public getPreference() {
    return this.get<number[]>(routing + 'preference');
  }

  public fetchClosest(latlng: ICoordinate) {
    return this.get<ICoordinate>(routing + 'closest', latlng);
  }

  public postPreference(preference: number[]) {
    return this.post(routing + 'preference', preference);
  }

  public findPreference() {
    return this.post(routing + 'find_preference');
  }

  public shortestPath(waypoints: ICoordinate[]) {
    return this.post<IPath>(routing + 'fsp', waypoints);
  }

  public resetData() {
    return this.post(routing + 'reset');
  }

  private get<T>(url: string, params?: any) {
    return this.apiCall<T>({ url, method: 'get', params } as IRequestConfig);
  }

  private post<T = any>(url: string, data?: any) {
    return this.apiCall<T>({ url, method: 'post', data } as IRequestConfig);
  }

  private async apiCall<T>({
    url,
    method,
    params,
    data,
  }: IRequestConfig): Promise<T> {
    try {
      const response = await axios({
        url,
        method,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        params,
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();
