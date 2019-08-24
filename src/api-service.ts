import axios from 'axios';

import endpoints from '@/endpoints';

class ApiService {
  public getPreference() {
    return this.apiCall<number[]>(endpoints.preference);
  }

  private apiCall<T = any>(
    url: string,
    method: any = 'GET',
    data?: any
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      axios({
        method,
        url,
        data,
      })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
}

export default new ApiService();
