import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAnalystArticles = () => {
  const [analystArticles, setAnalystArticles] = useState([]);

  const fetchAnalystArticles = async () => {
    try {
      const commitHash = process.env.VERCEL_GIT_COMMIT_REF;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://speedcisew20305backend-git-${commitHash}-tyler-gees-projects-ab3c2f84.vercel.app`;
      const response = await axios.get(`${backendUrl}/api/analyst-queue-articles`);
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
