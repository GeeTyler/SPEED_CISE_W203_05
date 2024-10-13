import React from 'react';
import { FaSearch } from 'react-icons/fa';
import useSpeedArticle from '@/app/hooks/useSpeedArticle';

interface ArticleDetailProps {
  articleId: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId }) => {
  const { article, loading: articleLoading, error: articleError } = useSpeedArticle(articleId);

  if (articleLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (articleError) {
    return <div className="text-center py-10 text-red-600">{articleError}</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-white">{article?.title}</h1>
      <div className="mb-4">
        <p className="mb-2"><strong>Authors:</strong> {article?.authors}</p>
        <p className="mb-2"><strong>Journal:</strong> {article?.journal}</p>
        <p className="mb-2"><strong>Year:</strong> {article?.year}</p>
        <p className="mb-2"><strong>DOI:</strong> {article?.doi}</p>
        <p className="mb-2"><strong>Publisher:</strong> {article?.publisher}</p>
        <p className="mb-4"><strong>Submitted:</strong> {new Date(article?.submittedAt).toLocaleString()}</p>
      </div>
      
      <a
        href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article?.doi}&type=AllFields`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <FaSearch className="mr-2" />
        Find Article
      </a>

      <div className="mt-6">
        <div className="mb-6">
          <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-2">
            Claim
          </label>
          <textarea
            id="claim"
            name="claim"
            value={article?.claim || ''}
            readOnly
            rows={6}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            placeholder="No claim available"
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;