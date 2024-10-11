import axios from 'axios';

export const useRejectArticle = (onArticleUpdate?: () => void) => {
  const handleReject = async (id: string) => {
    try {
      const commitHash = process.env.VERCEL_GIT_COMMIT_REF;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://speedcisew20305backend-git-${commitHash}-tyler-gees-projects-ab3c2f84.vercel.app`;
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
