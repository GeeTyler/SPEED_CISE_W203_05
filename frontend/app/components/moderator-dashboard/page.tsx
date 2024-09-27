'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ModeratorDashboardPage: React.FC = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles`);
        const sortedArticles = response.data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Articles Waiting for Review</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Authors</th>
                <th className="py-2 px-4 border-b">Journal</th>
                <th className="py-2 px-4 border-b">Year</th>
                <th className="py-2 px-4 border-b">DOI</th>
                <th className="py-2 px-4 border-b">Publisher</th>
                <th className="py-2 px-4 border-b">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td className="py-2 px-4 border-b">{article.title}</td>
                  <td className="py-2 px-4 border-b">{article.authors}</td>
                  <td className="py-2 px-4 border-b">{article.journal}</td>
                  <td className="py-2 px-4 border-b">{article.year}</td>
                  <td className="py-2 px-4 border-b">{article.doi}</td>
                  <td className="py-2 px-4 border-b">{article.publisher}</td>
                  <td className="py-2 px-4 border-b">{new Date(article.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
};

export default ModeratorDashboardPage;