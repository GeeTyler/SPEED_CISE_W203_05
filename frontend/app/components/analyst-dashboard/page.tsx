'use client';

import React from 'react';
import ArticlesTable from './_components/ArticlesTable';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';
import AnalystNotificationDropdown from './_components/analystNotificationDropdown';

const AnalystDashboard: React.FC = () => {
    const { analystArticles, fetchAnalystArticles } = useAnalystArticles();

    const handleArticleUpdate = () => {
        fetchAnalystArticles();
      };
      return (
        <main className="p-8">
                  <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Analyst Dashboard</h1>
        <AnalystNotificationDropdown />
      </div>
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

