import axios from 'axios';
import { useState } from 'react';

interface ClaimData {
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

const useSubmitClaim = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitClaim = async (data: ClaimData) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed`,
        data
      );
    } catch (err) {
      console.error(err);
      setError('Error submitting claim');
    } finally {
      setLoading(false);
    }
  };

  return { submitClaim, loading, error };
};

export default useSubmitClaim;