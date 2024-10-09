'use client';

import React, { useState } from 'react';
import ArticlesTable from '../moderator-dashboard/_components/ArticlesTable';
import NotificationDropdown from '@/app/ui/notificationdropdown/notificationdropdown';
import { useModeratorArticles } from '@/app/hooks/useModeratorArticles';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';
import ArticlesGrid from '../moderator-dashboard/_components/ArticlesGrid'; // New grid component

const UserDashboardPage: React.FC = () => {
  const { moderatorArticles } = useModeratorArticles();
  const { analystArticles } = useAnalystArticles();
  
  // State to toggle between 'table' and 'grid' view
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">User Dashboard</h1>
        <NotificationDropdown />
      </div>

      {/* Toggle View Button */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => setViewType(viewType === 'table' ? 'grid' : 'table')}
        >
          Switch to {viewType === 'table' ? 'Grid' : 'Table'} View
        </button>
      </div>

      {/* Conditionally Render Table or Grid View */}
      <h2 className="text-xl m-4">Articles Under Moderator Review</h2>
      {viewType === 'table' ? (
        <ArticlesTable articles={moderatorArticles} showActions={false} />
      ) : (
        <ArticlesGrid articles={moderatorArticles} /> // Grid view
      )}

      <h2 className="text-xl m-4">Articles Under Analyst Review</h2>
      {viewType === 'table' ? (
        <ArticlesTable articles={analystArticles} showActions={false} />
      ) : (
        <ArticlesGrid articles={analystArticles} /> // Grid view
      )}
    </main>
  );
};

export default UserDashboardPage;
