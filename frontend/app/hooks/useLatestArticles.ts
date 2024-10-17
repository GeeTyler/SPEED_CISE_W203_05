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
  claim: string;
}

const useLatestArticles = () => {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestArticles = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed/latest`);
      const sortedArticles = response.data.sort(
        (a: Article, b: Article) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setLatestArticles(sortedArticles);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching latest articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  return { latestArticles, loading, error, fetchLatestArticles };
};

export default useLatestArticles;