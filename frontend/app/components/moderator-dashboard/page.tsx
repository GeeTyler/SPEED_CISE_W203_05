'use client';

import React from 'react';
import useArticles from '@/app/hooks/useArticles'; 
import ArticlesTable from './_components/ArticlesTable'; 

const ModeratorDashboardPage: React.FC = () => {
  const articles = useArticles();

  return (
    <main className="p-8">
      <h1 className="text-2xl m-4">Articles Waiting for Review</h1>
      <ArticlesTable articles={articles} />
    </main>
  );
};

export default ModeratorDashboardPage;