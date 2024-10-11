import { useState, useEffect } from 'react';
import axios from 'axios';

export const useModeratorArticles = () => {
  const [moderatorArticles, setModeratorArticles] = useState([]);

  const fetchModeratorArticles = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://${process.env.VERCEL_URL}`;
      const response = await axios.get(`${backendUrl}/api/moderator-queue-articles`);
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
