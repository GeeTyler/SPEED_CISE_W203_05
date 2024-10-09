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

interface ArticlesGridProps {
  articles: Article[];
}

const ArticlesGrid: React.FC<ArticlesGridProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <div key={article._id} className="border p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-2">{article.title}</h3>
          <p className="text-sm">
            <strong>Authors: </strong>{article.authors}
          </p>
          <p className="text-sm">
            <strong>Journal: </strong>{article.journal}
          </p>
          <p className="text-sm">
            <strong>Year: </strong>{article.year}
          </p>
          <p className="text-sm">
            <strong>DOI: </strong>{article.doi}
          </p>
          <p className="text-sm">
            <strong>Publisher: </strong>{article.publisher}
          </p>
          <p className="text-sm">
            <strong>Submitted At: </strong>{new Date(article.submittedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ArticlesGrid;
