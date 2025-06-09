import { ApiService } from './apiService';

const apiService = new ApiService();

async function main() {
  try {
    const posts = await apiService.fetchData();
    const previewPosts = posts.map(({ userId, id, title }) => ({ userId, id, title }));
    console.table(previewPosts);
  } catch (e: any) {
    throw e;
  }


}

main();

