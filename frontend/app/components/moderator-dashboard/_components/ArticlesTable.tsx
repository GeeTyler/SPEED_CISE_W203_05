import React from 'react';
import { useApproveArticle } from '@/app/hooks/useApproveArticle';
import { useRejectArticle } from '@/app/hooks/useRejectArticle';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  publisher: string;
  submittedAt: string;
}

interface ArticlesTableProps {
  articles: Article[];
  showActions?: boolean;
  onArticleUpdate?: () => void;
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles, showActions = false, onArticleUpdate }) => {
  const { handleApprove } = useApproveArticle(onArticleUpdate);
  const { handleReject } = useRejectArticle(onArticleUpdate);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-indigo-600 rounded-lg hidden md:table">
        <thead className="bg-indigo-700 text-white">
          <tr>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Title</th>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Authors</th>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Journal</th>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Year</th>
            <th className="text-left py-2 px-4 border-b border-indigo-600">DOI</th>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Publisher</th>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Submitted At</th>
            {showActions && <th className="text-left py-2 px-4 border-b border-indigo-600">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id} className="hover:bg-indigo-400">
              <td className="py-2 px-4 border-b border-indigo-600">{article.title}</td>
              <td className="py-2 px-4 border-b border-indigo-600">{article.authors}</td>
              <td className="py-2 px-4 border-b border-indigo-600">{article.journal}</td>
              <td className="py-2 px-4 border-b border-indigo-600">{article.year}</td>
              <td className="py-2 px-4 border-b border-indigo-600">{article.doi}</td>
              <td className="py-2 px-4 border-b border-indigo-600">{article.publisher}</td>
              <td className="py-2 px-4 border-b border-indigo-600">
                {new Date(article.submittedAt).toLocaleString()}
              </td>
              {showActions && (
                <td className="py-2 px-4 border-b border-indigo-600">
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                      onClick={() => handleApprove(article._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      onClick={() => handleReject(article._id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {articles.map((article) => (
          <div key={article._id} className="border border-indigo-600 rounded-lg p-4 shadow-sm">
            <div className="mb-2">
              <span className="font-semibold">Title: </span>
              <span>{article.title}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Authors: </span>
              <span>{article.authors}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Journal: </span>
              <span>{article.journal}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Year: </span>
              <span>{article.year}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">DOI: </span>
              <span>{article.doi}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Publisher: </span>
              <span>{article.publisher}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Submitted At: </span>
              <span>{new Date(article.submittedAt).toLocaleString()}</span>
            </div>
            {showActions && (
              <div className="flex flex-col space-y-2 mt-4">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleApprove(article._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleReject(article._id)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesTable;
