import { useState, useEffect } from 'react';
import axios from 'axios';

export const useModeratorArticles = () => {
  const [moderatorArticles, setModeratorArticles] = useState([]);

  const fetchModeratorArticles = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles`);
      const sortedArticles = response.data.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );;
      setModeratorArticles(sortedArticles);
    } catch (error) {
      console.error('Error fetching moderator queue articles:', error);
    }
  };

  useEffect(() => {
    fetchModeratorArticles();
  }, []);

  return { moderatorArticles, fetchModeratorArticles };
};
