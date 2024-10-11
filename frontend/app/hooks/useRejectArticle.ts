import axios from 'axios';

export const useRejectArticle = (onArticleUpdate?: () => void) => {
  const handleReject = async (id: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles/${id}/reject`);
      if (onArticleUpdate) {
        onArticleUpdate();
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
    }
  };

  return { handleReject };
};
