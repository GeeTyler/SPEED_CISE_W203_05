import axios from 'axios';

const useRateArticle = () => {
  const rateArticle = async (ratingData: { articleId: string; rating: number }) => {
    try {
      const response = await axios.post(`/api/rate-article`, ratingData);

      return response.data; // axios automatically parses the response
    } catch (error) {
      console.error('Error rating article:', error);
      throw error;
    }
  };

  return { rateArticle };
};

export default useRateArticle;

  