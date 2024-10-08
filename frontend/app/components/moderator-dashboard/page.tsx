'use client';

import React from 'react';
import ArticlesTable from './_components/ArticlesTable';
import { useModeratorArticles } from '@/app/hooks/useModeratorArticles';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';
import ModeratorNotificationDropdown from './_components/moderatorNotificationDropdown';

const ModeratorDashboardPage: React.FC = () => {
  const { moderatorArticles, fetchModeratorArticles } = useModeratorArticles();
  const { analystArticles, fetchAnalystArticles } = useAnalystArticles();

  const handleArticleUpdate = () => {
    fetchModeratorArticles();
    fetchAnalystArticles();
  };

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Moderator Dashboard</h1>
        <ModeratorNotificationDropdown />
      </div>
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
