'use client';

import React, { useState } from 'react';
import useSubmitArticle from '@/app/hooks/useSubmitArticle';
import Label from '@/app/ui/Label';
import Input from '@/app/ui/Input';
import Button from '@/app/ui/Button';

const SubmitArticleForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [year, setYear] = useState('');
  const [doi, setDoi] = useState('');
  const [publisher, setPublisher] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { submitArticle } = useSubmitArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const articleData = {
      title,
      authors,
      journal,
      year: parseInt(year, 10),
      doi,
      publisher,
    };

    try {
      await submitArticle(articleData);
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
    <div className="flex justify-center items-center w-1000 m-auto max-md:w-11/12">
      <div className="py-6 rounded shadow flex items-center w-full justify-center">
        {success ? (
          <div className="text-green-500 text-lg font-medium text-center">
            {success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="title" text="Title" />
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter the article title"
              />
            </div>
            <div>
              <Label htmlFor="authors" text="Authors" />
              <Input
                id="authors"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                required
                placeholder="Enter authors"
              />
            </div>
            <div>
              <Label htmlFor="journal" text="Journal" />
              <Input
                id="journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                required
                placeholder="Enter the journal name"
              />
            </div>
            <div>
              <Label htmlFor="year" text="Year" />
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                min={1000}
                max={9999}
                placeholder="e.g., 2023"
              />
            </div>
            <div>
              <Label htmlFor="doi" text="DOI" />
              <Input
                id="doi"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                required
                placeholder="Enter the DOI"
              />
            </div>
            <div>
              <Label htmlFor="publisher" text="Publisher" />
              <Input
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                required
                placeholder="Enter the publisher's name"
              />
            </div>
            <Button type="submit">Submit Article</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitArticleForm;
