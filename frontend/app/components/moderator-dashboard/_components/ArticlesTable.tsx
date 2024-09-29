import React from 'react';

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
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles }) => {
  return (
    <table className="min-w-full border border-indigo-600 rounded-lg">
      <thead>
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
          <tr key={article._id}>
            <td className="py-2 px-4 border-b border-indigo-600">{article.title}</td>
            <td className="text-right py-2 px-4 border-b border-indigo-600">{article.authors}</td>
            <td className="text-right py-2 px-4 border-b border-indigo-600">{article.journal}</td>
            <td className="text-right py-2 px-4 border-b border-indigo-600">{article.year}</td>
            <td className="text-right py-2 px-4 border-b border-indigo-600">{article.doi}</td>
            <td className="text-right py-2 px-4 border-b border-indigo-600">{article.publisher}</td>
            <td className="py-2 px-4 border-b text-right border-indigo-600">
              {new Date(article.submittedAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArticlesTable;
