import { useState } from 'react';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  publisher: string;
  doi: string;
}

interface SearchResponse {
  articles: Article[];
}

const useSearchArticles = () => {
  const [loading, setLoading] = useState(false);

  const searchArticles = async (searchParams: {
    method: string;
    startYear: number;
    endYear: number;
  }): Promise<Article[]> => {
    setLoading(true);

    try {
      const response = await axios.post<SearchResponse>(`/api/search-articles`, searchParams);
      return response.data.articles; // axios automatically parses the JSON response
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error; // Ensure to handle this in the calling component
    } finally {
      setLoading(false); // Ensure loading state is reset in both success and error cases
    }
  };

  return { searchArticles, loading };
};

export default useSearchArticles;
