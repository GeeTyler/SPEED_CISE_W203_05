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

interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
}

const useSearchArticles = () => {
  const [error, setError] = useState<string | null>(null);

  const searchArticles = async (
    searchParams: SearchParams,
  ): Promise<{ articles: Article[]; total: number }> => {
    setError(null);

    try {
      const params: Record<string, string> = {};

      if (searchParams.query) {
        params.q = searchParams.query;
      }
      if (searchParams.page !== undefined) {
        params.page = searchParams.page.toString();
      }
      if (searchParams.limit !== undefined) {
        params.limit = searchParams.limit.toString();
      }

      const queryString = new URLSearchParams(params).toString();
      const query = queryString ? `?${queryString}` : '';

      const response = await axios.get<{ articles: Article[]; total: number }>(
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
      return { articles: [], total: 0 };
    }
  };

  return { searchArticles, error };
};

export default useSearchArticles;
