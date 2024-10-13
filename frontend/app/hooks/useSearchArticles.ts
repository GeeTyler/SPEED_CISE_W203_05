import { useState } from 'react';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  publisher: string;
  doi: string;
}

const useSearchArticles = () => {
  const [error, setError] = useState<string | null>(null);

  const searchArticles = async (searchParams: { doi?: string }): Promise<Article[]> => {
    setError(null);

    try {
      const query = searchParams.doi ? `?q=${encodeURIComponent(searchParams.doi)}` : '';
      const response = await axios.get<Article[]>(`http://localhost:8082/api/speed/search${query}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching articles:', error);
        setError(error.response?.data?.message || 'Error fetching articles. Please try again later.');
      } else {
        console.error('Unexpected error:', error);
        setError('Error fetching articles. Please try again later.');
      }
      return [];
    }
  };

  return { searchArticles, error };
};

export default useSearchArticles;
