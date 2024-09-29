import React from 'react';
import axios from 'axios';

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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-indigo-600 rounded-lg">
        <thead className="hidden md:table-header-group">
          <tr>
            <th className="text-left py-2 px-4 border-b border-indigo-600">Title</th>
            <th className="text-right py-2 px-4 border-b border-indigo-600">Authors</th>
            <th className="text-right py-2 px-4 border-b border-indigo-600">Journal</th>
            <th className="text-right py-2 px-4 border-b border-indigo-600">Year</th>
            <th className="text-right py-2 px-4 border-b border-indigo-600">DOI</th>
            <th className="text-right py-2 px-4 border-b border-indigo-600">Publisher</th>
            <th className="text-right py-2 px-4 border-b border-indigo-600">Submitted At</th>
            {showActions && <th className="text-right py-2 px-4 border-b border-indigo-600">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id} className="block md:table-row">
              {/* Title */}
              <td className="max-md:text-right block md:table-cell py-2 px-4 border-b border-indigo-600">
                <span className="font-semibold md:hidden">Title: </span>
                {article.title}
              </td>
              {/* Authors */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <span className="font-semibold md:hidden">Authors: </span>
                {article.authors}
              </td>
              {/* Journal */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <span className="font-semibold md:hidden">Journal: </span>
                {article.journal}
              </td>
              {/* Year */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <span className="font-semibold md:hidden">Year: </span>
                {article.year}
              </td>
              {/* DOI */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <span className="font-semibold md:hidden">DOI: </span>
                {article.doi}
              </td>
              {/* Publisher */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <span className="font-semibold md:hidden">Publisher: </span>
                {article.publisher}
              </td>
              {/* Submitted At */}
              <td className="block md:table-cell py-2 px-4 border-b text-right border-indigo-600">
                <span className="font-semibold md:hidden">Submitted At: </span>
                {new Date(article.submittedAt).toLocaleString()}
              </td>
              {showActions && (
                <td className="block md:table-cell py-2 px-4 border-b text-right border-indigo-600">
                  <div className="flex flex-col gap-2 items-end">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleApprove(article._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
    </div>
  );
};

export default ArticlesTable;
