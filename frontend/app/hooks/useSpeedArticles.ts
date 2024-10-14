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

const useSpeedArticles = () => {
  const [speedArticles, setSpeedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeedArticles = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed`);
      const sortedArticles = response.data.sort(
        (a: Article, b: Article) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setSpeedArticles(sortedArticles);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching latest articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeedArticles();
  }, []);

  return { speedArticles: speedArticles, loading, error, fetchSpeedArticles: fetchSpeedArticles };
};

export default useSpeedArticles;