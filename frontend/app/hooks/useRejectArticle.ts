import axios from 'axios';

export const useRejectArticle = (onArticleUpdate?: () => void) => {
  const handleReject = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://${process.env.VERCEL_URL}`;
      await axios.patch(`${backendUrl}/api/moderator-queue-articles/${id}/reject`);
      if (onArticleUpdate) {
        onArticleUpdate();
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
    }
  };

  return { handleReject };
};
