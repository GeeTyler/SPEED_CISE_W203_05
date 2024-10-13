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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchArticles = async (searchParams: { doi?: string }): Promise<Article[]> => {
    setLoading(true);
    setError(null); // Reset error state before making the request

    try {
      // Construct the query string based on whether DOI is provided
      const query = searchParams.doi ? `?q=${encodeURIComponent(searchParams.doi)}` : '';
      // Make the API request to your backend
      const response = await axios.get<Article[]>(`http://localhost:8082/api/speed/search${query}`);
      
      return response.data; // Return the array of articles
    } catch (error) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error('Error fetching articles:', error);
        
        // Use the response message if available
        setError(error.response?.data?.message || 'Error fetching articles. Please try again later.');
      } else {
        console.error('Unexpected error:', error);
        setError('Error fetching articles. Please try again later.');
      }

      return []; // Return an empty array in case of error
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return { searchArticles, loading, error }; // Return the necessary functions and states
};

export default useSearchArticles;
