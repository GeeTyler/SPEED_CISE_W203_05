'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticlesTable from './_components/ArticlesTable';

const ModeratorDashboardPage: React.FC = () => {
  const [moderatorArticles, setModeratorArticles] = useState([]);
  const [analystArticles, setAnalystArticles] = useState([]);

  const fetchModeratorArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles`
      );
      const sortedArticles = response.data.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setModeratorArticles(sortedArticles);
    } catch (error) {
      console.error('Error fetching moderator queue articles:', error);
    }
  };

  const fetchAnalystArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyst-queue-articles`
      );
      const sortedArticles = response.data.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setAnalystArticles(sortedArticles);
    } catch (error) {
      console.error('Error fetching analyst queue articles:', error);
    }
  };

  useEffect(() => {
    fetchModeratorArticles();
    fetchAnalystArticles();
  }, []);

  const handleArticleUpdate = () => {
    fetchModeratorArticles();
    fetchAnalystArticles();
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl m-4">Articles Waiting for Review</h1>
      <ArticlesTable
        articles={moderatorArticles}
        showActions={true}
        onArticleUpdate={handleArticleUpdate}
      />

      <h1 className="text-2xl m-4">Under Review</h1>
      <ArticlesTable articles={analystArticles} showActions={false} />
    </main>
  );
};

export default ModeratorDashboardPage;
