'use client';

import React from 'react';
import ArticlesTable from './_components/ArticlesTable';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';

const AnalystDashboard: React.FC = () => {
    const { analystArticles, fetchAnalystArticles } = useAnalystArticles();

    const handleArticleUpdate = () => {
        fetchAnalystArticles();
      };
      return (
        <main className="p-8">
          <h1 className="text-2xl m-4">Analyst Queue Articles</h1>
          <ArticlesTable
            articles={analystArticles}
            showActions={true}
            onArticleUpdate={handleArticleUpdate}
          />

        </main>
    );
};

export default AnalystDashboard;

