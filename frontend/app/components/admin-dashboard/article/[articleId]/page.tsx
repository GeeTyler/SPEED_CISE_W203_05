"use client"
import { useParams } from 'next/navigation';
import ArticleDetail from '@/app/components/admin-dashboard/_components/ArticleDetail';

const ArticlePage: React.FC = () => {
  const params = useParams();
  const articleId = Array.isArray(params.articleId) ? params.articleId[0] : params.articleId;

  if (!articleId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ArticleDetail articleId={articleId} />
    </div>
  );
};

export default ArticlePage;