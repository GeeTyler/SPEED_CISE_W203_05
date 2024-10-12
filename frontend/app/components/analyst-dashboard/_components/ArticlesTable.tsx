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
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id} className="block md:table-row cursor-pointer">
              {/* Title */}
              <td className="max-md:text-right block md:table-cell py-2 px-4 border-b border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">Title: </span>
                    {article.title}
                  </a>
                </Link>
              </td>
              {/* Authors */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">Authors: </span>
                    {article.authors}
                  </a>
                </Link>
              </td>
              {/* Journal */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">Journal: </span>
                    {article.journal}
                  </a>
                </Link>
              </td>
              {/* Year */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">Year: </span>
                    {article.year}
                  </a>
                </Link>
              </td>
              {/* DOI */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">DOI: </span>
                    {article.doi}
                  </a>
                </Link>
              </td>
              {/* Publisher */}
              <td className="block md:table-cell py-2 px-4 border-b border-indigo-600 text-right">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">Publisher: </span>
                    {article.publisher}
                  </a>
                </Link>
              </td>
              {/* Submitted At */}
              <td className="block md:table-cell py-2 px-4 border-b text-right border-indigo-600">
                <Link href={`/components/analyst-dashboard/article/${article._id}`} legacyBehavior>
                  <a>
                    <span className="font-semibold md:hidden">Submitted At: </span>
                    {new Date(article.submittedAt).toLocaleString()}
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesTable;