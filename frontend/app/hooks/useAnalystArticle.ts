import { useState, useEffect } from 'react';
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

const useAnalystArticle = (articleId: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyst-queue-articles/${articleId}`
        );
        setArticle(response.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  return { article, loading, error };
};

export default useAnalystArticle;