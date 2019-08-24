import axios from 'axios';

import endpoints from '@/endpoints';

class ApiService {
  public getPreference() {
    return this.apiCall<number[]>(endpoints.preference);
  }

  private async apiCall<T = any>(
    url: string,
    method: any = 'GET',
    data?: any
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();
