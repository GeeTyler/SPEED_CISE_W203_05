'use client';

import React, { useState } from 'react';
import axios from 'axios';

const SubmitArticleForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState('');
  const [doi, setDoi] = useState('');
  const [publisher, setPublisher] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !authors || !journal || !year || !doi || !publisher) {
      setError('All fields are required.');
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      setError('Year must be a valid 4-digit year.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/moderator-queue-articles`, {
        title,
        authors,
        journal,
        year: parseInt(year),
        doi,
        publisher,
      });
      setSuccess('Article submitted successfully!');
      setTitle('');
      setAuthors('');
      setJournal('');
      setYear('');
      setDoi('');
      setPublisher('');
    } catch (error) {
      setError('Error submitting article.');
      console.error('Error submitting article:', error);
    }
  };

  return (
    <div className="justify-center min-h-screen">
      {success ? (
        <div className="text-green-500 text-lg font-medium text-center mt-4">
          {success}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
              Authors
            </label>
            <input
              type="text"
              id="authors"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
              Journal
            </label>
            <input
              type="text"
              id="journal"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="doi" className="block text-sm font-medium text-gray-700">
              DOI
            </label>
            <input
              type="text"
              id="doi"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Article
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitArticleForm;