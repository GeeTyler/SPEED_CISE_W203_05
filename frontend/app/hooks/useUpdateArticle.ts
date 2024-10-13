import { useState } from 'react';
import axios from 'axios';

const useUpdateArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateArticle = async (articleId: string, updatedArticle: unknown) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed/${articleId}`, updatedArticle);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateArticle, loading, error };
};

export default useUpdateArticle;
