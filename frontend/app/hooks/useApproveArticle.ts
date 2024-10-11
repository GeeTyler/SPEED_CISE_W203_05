import axios from 'axios';

export const useApproveArticle = (onArticleUpdate?: () => void) => {
  const handleApprove = async (id: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles/${id}/approve`);
      if (onArticleUpdate) {
        onArticleUpdate();
      }
    } catch (error) {
      console.error('Error approving article:', error);
    }
  };

  return { handleApprove };
};
