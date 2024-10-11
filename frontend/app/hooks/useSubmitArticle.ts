import axios from 'axios';

interface ArticleData {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  publisher: string;
}

const useSubmitArticle = () => {
  const submitArticle = async (data: ArticleData): Promise<void> => {
    if (
      !data.title ||
      !data.authors ||
      !data.journal ||
      !data.year ||
      !data.doi ||
      !data.publisher
    ) {
      throw new Error('All fields are required.');
    }

    if (!/^\d{4}$/.test(data.year.toString())) {
      throw new Error('Year must be a valid 4-digit year.');
    }

    try {
      const commitHash = process.env.VERCEL_GIT_COMMIT_REF;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://speedcisew20305backend-git-${commitHash}-tyler-gees-projects-ab3c2f84.vercel.app`;
      await axios.post(
        `${backendUrl}/api/moderator-queue-articles`,
        data
      );
    } catch (error) {
      console.error('Error submitting article:', error);
      throw new Error('Error submitting article.');
    }
  };

  return { submitArticle };
};

export default useSubmitArticle;
