'use client';

import React, { useState, useEffect } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles'; 
import Input from '@/app/ui/Input';
import Button from '@/app/ui/Button';

const SearchPage: React.FC = () => {
  const [input, setInput] = useState(''); // State for input
  interface Article {
    _id: string;
    title: string;
    authors: string;
    journal: string;
    year: string | number;
    publisher: string;
    doi: string;
  }

  const [articles, setArticles] = useState<Article[]>([]); // Initialize articles as an empty array
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const { searchArticles } = useSearchArticles();

  // Function to fetch all articles
  const fetchAllArticles = React.useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchArticles({}); // Fetch all articles from API
      setArticles(results);
      setNoResults(results.length === 0);
      setError(null);
    } catch {
      setError('Error fetching articles.');
    } finally {
      setLoading(false);
    }
  }, [searchArticles]);

  // Fetch all articles on component mount
  useEffect(() => {
    fetchAllArticles(); // Automatically fetch all articles on load
  }, [fetchAllArticles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoResults(false);
    setLoading(true); // Start loading state

    try {
      if (!input.trim()) {
        fetchAllArticles(); // Fetch all articles if DOI input is empty
      } else {
        const results = await searchArticles({ doi: input }); // Fetch articles based on DOI
        setNoResults(results.length === 0);
        setArticles(results);
      }
      setInput(''); // Clear DOI input after submission
    } catch {
      setError('Error fetching articles.');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-1000 m-auto max-md:w-11/12">
      <div className="py-6 rounded shadow flex items-center w-full justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <Input
              id="search"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for..." // Updated placeholder to match the test
            />
          </div>
          <Button type="submit">{loading ? 'Searching...' : 'Search'}</Button>
        </form>
      </div>

      {loading && <div className="mt-6">Loading articles...</div>} {/* Loading indicator */}

      <div className="mt-6 w-full">
        {noResults && (
          <div className="text-center text-red-500">
            No results found. Please try another search.
          </div>
        )}

        {Array.isArray(articles) && articles.length > 0 && ( // Ensure articles is an array and has length
          <>
            <h2 className="text-lg font-bold">Search Results</h2>
            <ul>
              {articles.map((article) => (
                <li key={article._id} className="border p-4 mb-2">
                  <h3 className="text-md font-medium">{article.title}</h3>
                  <p>{article.authors}</p>
                  <p>{article.journal} - {article.year}</p>
                  <p>Publisher: {article.publisher}</p>
                  <p>DOI: <a href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article?.doi}&type=AllFields`} target="_blank" rel="noopener noreferrer">{article.doi}</a></p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
