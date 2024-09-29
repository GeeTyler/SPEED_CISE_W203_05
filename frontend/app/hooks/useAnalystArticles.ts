import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAnalystArticles = () => {
  const [analystArticles, setAnalystArticles] = useState([]);

  const fetchAnalystArticles = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyst-queue-articles`);
      const sortedArticles = response.data.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );;
      setAnalystArticles(sortedArticles);
    } catch (error) {
      console.error('Error fetching analyst queue articles:', error);
    }
  };

  useEffect(() => {
    fetchAnalystArticles();
  }, []);

  return { analystArticles, fetchAnalystArticles };
};
