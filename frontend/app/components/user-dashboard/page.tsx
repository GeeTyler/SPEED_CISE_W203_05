'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticlesTable from '../moderator-dashboard/_components/ArticlesTable';
import NotificationDropdown from '@/app/ui/notificationdropdown/notificationdropdown';

const UserDashboardPage: React.FC = () => {
  const [moderatorArticles, setModeratorArticles] = useState([]);
  const [analystArticles, setAnalystArticles] = useState([]);

  const fetchModeratorArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles`,
      );
      setModeratorArticles(response.data);
    } catch (error) {
      console.error('Error fetching moderator queue articles:', error);
    }
  };

  const fetchAnalystArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyst-queue-articles`,
      );
      setAnalystArticles(response.data);
    } catch (error) {
      console.error('Error fetching analyst queue articles:', error);
    }
  };

  useEffect(() => {
    fetchModeratorArticles();
    fetchAnalystArticles();
  }, []);

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
