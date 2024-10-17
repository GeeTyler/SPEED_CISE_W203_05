import React from 'react';
import Link from 'next/link';

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

const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles }) => {
  return (
    <div className="overflow-x-auto p-4">
      {/* Desktop Table View */}
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
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id} className="hover:bg-indigo-400 cursor-pointer">
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {article.title}
                  </a>
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {article.authors}
                  </a>
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {article.journal}
                  </a>
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {article.year}
                  </a>
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {article.doi}
                  </a>
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {article.publisher}
                  </a>
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a className="block">
                    {new Date(article.submittedAt).toLocaleString()}
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {articles.map((article) => (
          <Link
            key={article._id}
            href={`/components/analyst-dashboard/article/${article._id}`}
            legacyBehavior
          >
            <a className="block border border-indigo-600 rounded-lg p-4 shadow-sm hover:bg-indigo-50">
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
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticlesTable;
