import axios from 'axios';

const apiBaseUrl = 'https://jsonplaceholder.typicode.com/posts';

export type UserInfo = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface IApiService {
  fetchData: () => Promise<UserInfo[]>;
}

export class ApiService implements IApiService {
  async fetchData() {
    try {
      const response = await axios.get<UserInfo[]>(apiBaseUrl);
      return response.data;
    } catch (e: any) {
      console.log(e?.message || 'Error happened');
      throw('Error during the request')
    }
  }
}

