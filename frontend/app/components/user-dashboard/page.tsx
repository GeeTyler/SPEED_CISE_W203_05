'use client';

import React from 'react';
import ArticlesTable from '../moderator-dashboard/_components/ArticlesTable';
import NotificationDropdown from '@/app/ui/notificationdropdown/notificationdropdown';
import { useModeratorArticles } from '@/app/hooks/useModeratorArticles';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';

const UserDashboardPage: React.FC = () => {
  const { moderatorArticles } = useModeratorArticles();
  const { analystArticles } = useAnalystArticles();

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">User Dashboard</h1>
        <NotificationDropdown />
      </div>

      <h2 className="text-xl m-4">Articles Under Moderator Review</h2>
      <ArticlesTable articles={moderatorArticles} showActions={false} />

      <h2 className="text-xl m-4">Articles Under Analyst Review</h2>
      <ArticlesTable articles={analystArticles} showActions={false} />
    </main>
  );
};

export default UserDashboardPage;
