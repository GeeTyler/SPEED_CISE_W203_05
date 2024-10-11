import { useEffect, useState } from 'react';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  publisher: string;
  submittedAt: string;
}

const useModeratorQueueArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const commitHash = process.env.VERCEL_GIT_COMMIT_REF;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://speedcisew20305backend-git-${commitHash}-tyler-gees-projects-ab3c2f84.vercel.app`;
        const response = await axios.get(
          `${backendUrl}/api/moderator-queue-articles`
        );
        const sortedArticles = response.data.sort(
          (a: Article, b: Article) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching moderator queue articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return articles;
};

export default useModeratorQueueArticles;
