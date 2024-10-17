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
  averageRating?: number | null;
}

interface SearchParams {
  query?: string;
}

const useSearchArticles = () => {
  const [error, setError] = useState<string | null>(null);

  const searchArticles = async (
    searchParams: SearchParams,
  ): Promise<Article[]> => {
    setError(null);

    try {
      const params: Record<string, string> = {};

      if (searchParams.query) {
        params.q = searchParams.query;
      }

      const queryString = new URLSearchParams(params).toString();
      const query = queryString ? `?${queryString}` : '';

      const response = await axios.get<Article[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed/search${query}`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching articles:', error);
        setError(
          error.response?.data?.message ||
            'Error fetching articles. Please try again later.',
        );
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
