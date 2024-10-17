'use client';

import React, { useState } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles'; 
import Input from '@/app/ui/Input';
import Button from '@/app/ui/Button';
import {Article} from '@/app/types/Article';

const SearchPage: React.FC = () => {
  const [input, setInput] = useState(''); // State for input
  const [searchInput, setSearchInput] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); 
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { searchArticles } = useSearchArticles();

  const fetchArticles = React.useCallback(
    async (searchInput: string, pageNumber: number) => {
      setLoading(true);
      try {
        const results = await searchArticles({
          query: searchInput,
          page: pageNumber,
          limit,
        });
        setArticles(results.articles);
        setTotalResults(results.total);
        setNoResults(results.articles.length === 0);
        setError(null);
      } catch {
        setError('Error fetching articles.');
      } finally {
        setLoading(false);
      }
    },
    [searchArticles, limit],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoResults(false);
    setPage(1); 
    const trimmedInput = input.trim();
    setSearchInput(trimmedInput);
    await fetchArticles(trimmedInput, 1);
    setInput(''); 
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchArticles(searchInput, newPage);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalResults / limit);
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchArticles(searchInput, newPage);
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
              placeholder="Search for..."
            />
          </div>
          <Button type="submit">{loading ? 'Searching...' : 'Search'}</Button>
        </form>
      </div>

      {loading && <div className="mt-6">Loading articles...</div>}

      <div className="mt-6 w-full">
        {noResults && (
          <div className="text-center text-red-500">
            No results found. Please try another search.
          </div>
        )}

        {Array.isArray(articles) && articles.length > 0 && (
          <>
            <h2 className="text-lg font-bold">Search Results</h2>
            <ul>
              {articles.map((article) => (
                <li key={article._id} className="border p-4 mb-2">
                  <h3 className="text-md font-medium">{article.title}</h3>
                  <p>{article.authors}</p>
                  <p>
                    {article.journal} - {article.year}
                  </p>
                  <p>Publisher: {article.publisher}</p>
                  <p>
                    DOI:{' '}
                    <a
                      href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article?.doi}&type=AllFields`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.doi}
                    </a>
                  </p>
                </li>
              ))}
            </ul>

            {totalResults > limit && (
              <div className="flex justify-between mt-4">
                <Button onClick={handlePrevPage} disabled={page === 1}>
                  Previous
                </Button>
                <div>
                  Page {page} of {Math.ceil(totalResults / limit)}
                </div>
                <Button
                  onClick={handleNextPage}
                  disabled={page === Math.ceil(totalResults / limit)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;