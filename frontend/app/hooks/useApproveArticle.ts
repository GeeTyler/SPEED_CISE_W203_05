import axios from 'axios';

export const useApproveArticle = (onArticleUpdate?: () => void) => {
  const handleApprove = async (id: string) => {
    try {
      const commitHash = process.env.VERCEL_GIT_COMMIT_REF;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://speedcisew20305backend-git-${commitHash}-tyler-gees-projects-ab3c2f84.vercel.app`;
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
