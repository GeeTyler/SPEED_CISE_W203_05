import axios from 'axios';

export const useApproveArticle = (onArticleUpdate?: () => void) => {
  const handleApprove = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://${process.env.VERCEL_URL}`;
      await axios.patch(`${backendUrl}/api/moderator-queue-articles/${id}/approve`);
      if (onArticleUpdate) {
        onArticleUpdate();
      }
    } catch (error) {
      console.error('Error approving article:', error);
    }
  };

  return { handleApprove };
};
