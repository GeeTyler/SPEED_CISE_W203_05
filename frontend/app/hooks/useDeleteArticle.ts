import { useState } from 'react';
import axios from 'axios';

const useDeleteArticle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteArticle = async (articleId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed/${articleId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteArticle, loading, error };
};

export default useDeleteArticle;
