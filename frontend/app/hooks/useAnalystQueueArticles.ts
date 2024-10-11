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

const useAnalystQueueArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyst-queue-articles`
        );
        const sortedArticles = response.data.sort(
          (a: Article, b: Article) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching analyst queue articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return articles;
};

export default useAnalystQueueArticles;
