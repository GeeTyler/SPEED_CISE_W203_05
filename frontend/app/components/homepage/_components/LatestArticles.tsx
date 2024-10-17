import React from 'react';
import Link from 'next/link';
import useLatestArticles from '@/app/hooks/useLatestArticles';

const LatestArticles = () => {
  const { latestArticles, loading, error } = useLatestArticles();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Desktop Layout */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border border-indigo-600 rounded-lg">
          <thead>
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
            {latestArticles.map((article) => (
              <tr key={article._id} className="cursor-pointer">
                <td className="py-2 px-4 border-b border-indigo-600">
                  <Link href={`/components/homepage/article/${article._id}`}>
                    {article.title}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b border-indigo-600">
                  {article.authors}
                </td>
                <td className="py-2 px-4 border-b border-indigo-600">
                  {article.journal}
                </td>
                <td className="py-2 px-4 border-b border-indigo-600">
                  {article.year}
                </td>
                <td className="py-2 px-4 border-b border-indigo-600">
                  {article.doi}
                </td>
                <td className="py-2 px-4 border-b border-indigo-600">
                  {article.publisher}
                </td>
                <td className="py-2 px-4 border-b border-indigo-600">
                  {new Date(article.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center">
        {latestArticles.map((article) => (
          <div key={article._id} className="border border-indigo-600 rounded-lg p-4 mb-4 w-[90%]">
            <Link href={`/components/homepage/article/${article._id}`}>
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p>
                <span className="font-semibold">Authors:</span> {article.authors}
              </p>
              <p>
                <span className="font-semibold">Journal:</span> {article.journal}
              </p>
              <p>
                <span className="font-semibold">Year:</span> {article.year}
              </p>
              <p>
                <span className="font-semibold">DOI:</span> {article.doi}
              </p>
              <p>
                <span className="font-semibold">Publisher:</span> {article.publisher}
              </p>
              <p>
                <span className="font-semibold">Submitted At:</span>{' '}
                {new Date(article.submittedAt).toLocaleString()}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestArticles;
