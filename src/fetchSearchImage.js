import axios from 'axios';

export async function fetchSearchImage(page, searchQuery) {
  const API_URL = 'https://pixabay.com/api/';
  const KEY = '?key=33719885-4078ecd8a7ef8c07d3287ea16';

  const responses = await axios.get(
    `${API_URL}${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );

  return await responses.data;
}
