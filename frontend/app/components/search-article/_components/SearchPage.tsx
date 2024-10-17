'use client';

import React, { useState } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles';
import Input from '@/app/ui/Input';
import {Button} from '@/components/ui/button';
import { Article } from '@/app/types/Article';
import axios from 'axios';

const SearchPage: React.FC = () => {
  const [input, setInput] = useState(''); // State for input
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(false); // State for toggling between views
  const { searchArticles } = useSearchArticles();

  // State to manage the visibility of columns
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    authors: true,
    journal: true,
    year: true,
    doi: true,
    publisher: true,
    rating: true, // Add rating column
  });

  // State for rating inputs
  const [ratingsInput, setRatingsInput] = useState<{ [articleId: string]: number }>({});

  // Filter states
  const [filters, setFilters] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
  });

  const fetchArticles = React.useCallback(
    async (searchInput: string) => {
      setLoading(true);
      try {
        const results = await searchArticles({
          query: searchInput,
        });
        setArticles(results);
        setError(null);
      } catch {
        setError('Error fetching articles.');
      } finally {
        setLoading(false);
      }
    },
    [searchArticles],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedInput = input.trim();
    await fetchArticles(trimmedInput);
    setInput('');
  };

  // Handle toggling between grid and table view
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Handle checkbox change to toggle visibility of columns
  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column], // Toggle the column's visibility
    }));
  };

  // Update filter state based on user input
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value.toLowerCase(),
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      title: '',
      authors: '',
      journal: '',
      year: '',
    });
  };

  // Handle rating input change
  const handleRatingChange = (articleId: string, value: string) => {
    const rating = parseInt(value, 10);
    if (rating >= 1 && rating <= 10) {
      setRatingsInput((prev) => ({ ...prev, [articleId]: rating }));
    }
  };

  // Submit rating
  const submitRating = async (articleId: string) => {
    const rating = ratingsInput[articleId];
    if (!rating) {
      alert('Please enter a rating between 1 and 10');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed/${articleId}/rate`,
        {
          rating: rating,
        },
      );

      // Fetch articles again to get updated ratings
      await fetchArticles(input);

      // Provide feedback
      alert('Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating');
    }
  };

  // Filtered articles based on filters state
  const filteredArticles = articles.filter((article) => {
    return (
      (!filters.title ||
        article.title.toLowerCase().includes(filters.title)) &&
      (!filters.authors ||
        article.authors.toLowerCase().includes(filters.authors)) &&
      (!filters.journal ||
        article.journal.toLowerCase().includes(filters.journal)) &&
      (!filters.year || article.year.toString().includes(filters.year))
    );
  });

  return (
    <div className="flex flex-col justify-center items-center w-[1200px] m-auto max-md:w-11/12">
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

      {/* View Toggle Button */}
      <div className="my-4">
        <Button onClick={toggleView}>
          Switch to {isGridView ? 'Table' : 'Grid'} View
        </Button>
      </div>

      {/* Column Selector */}
      <div className="flex gap-2 my-4">
        {Object.keys(visibleColumns).map((col) => (
          <label key={col} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visibleColumns[col as keyof typeof visibleColumns]}
              onChange={() => handleColumnToggle(col)}
            />
            <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
          </label>
        ))}
      </div>

      {/* Filter Inputs */}
      <div className="flex gap-4 mb-6">
        <Input
          id="filter-title"
          placeholder="Filter by Title"
          value={filters.title}
          onChange={(e) => handleFilterChange(e, 'title')}
          className="text-black"
        />
        <Input
          id="filter-authors"
          placeholder="Filter by Authors"
          value={filters.authors}
          onChange={(e) => handleFilterChange(e, 'authors')}
          className="text-black"
        />
        <Input
          id="filter-journal"
          placeholder="Filter by Journal"
          value={filters.journal}
          onChange={(e) => handleFilterChange(e, 'journal')}
          className="text-black"
        />
        <Input
          id="filter-year"
          placeholder="Filter by Year"
          value={filters.year}
          onChange={(e) => handleFilterChange(e, 'year')}
          className="text-black"
        />
      </div>

      {/* Clear Filters Button */}
      <div className="my-4">
        <Button onClick={clearFilters}>Clear Filters</Button>
      </div>

      <div className="mt-6 w-full">
        {filteredArticles.length > 0 ? (
          <>
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article._id}
                    className="border p-4 rounded-lg shadow-lg"
                  >
                    {visibleColumns.title && (
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                    )}
                    {visibleColumns.authors && (
                      <p className="text-sm">
                        <strong>Authors: </strong>
                        {article.authors}
                      </p>
                    )}
                    {visibleColumns.journal && (
                      <p className="text-sm">
                        <strong>Journal: </strong>
                        {article.journal}
                      </p>
                    )}
                    {visibleColumns.year && (
                      <p className="text-sm">
                        <strong>Year: </strong>
                        {article.year}
                      </p>
                    )}
                    {visibleColumns.doi && (
                      <p className="text-sm">
                        <strong>DOI: </strong>
                        <a
                          href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?lookfor=${article.doi}&type=AllFields`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {article.doi}
                        </a>
                      </p>
                    )}
                    {visibleColumns.publisher && (
                      <p className="text-sm">
                        <strong>Publisher: </strong>
                        {article.publisher}
                      </p>
                    )}
                    {visibleColumns.rating && (
                      <div className="mt-2 flex flex-row justify-center items-center gap-2 items-end">
                        <div>
                        <strong>Rating: </strong>
                        {article.averageRating !== null
                          ? `${article.averageRating}/10`
                          : '?/10'}
                          </div>
                        <div className="flex flex-row gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={ratingsInput[article._id] || ''}
                            onChange={(e) =>
                              handleRatingChange(article._id, e.target.value)
                            }
                            className="w-20 rounded-lg text-black text-right"
                          />
                          <Button onClick={() => submitRating(article._id)}>
                            Submit Rating
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-indigo-600 rounded-lg">
                  <thead>
                    <tr>
                      {visibleColumns.title && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          Title
                        </th>
                      )}
                      {visibleColumns.authors && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          Authors
                        </th>
                      )}
                      {visibleColumns.journal && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          Journal
                        </th>
                      )}
                      {visibleColumns.year && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          Year
                        </th>
                      )}
                      {visibleColumns.doi && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          DOI
                        </th>
                      )}
                      {visibleColumns.publisher && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          Publisher
                        </th>
                      )}
                      {visibleColumns.rating && (
                        <th className="text-left py-2 px-4 border-b border-indigo-600">
                          Rating
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article._id}>
                        {visibleColumns.title && (
                          <td className="py-2 px-4 border-b">{article.title}</td>
                        )}
                        {visibleColumns.authors && (
                          <td className="py-2 px-4 border-b">
                            {article.authors}
                          </td>
                        )}
                        {visibleColumns.journal && (
                          <td className="py-2 px-4 border-b">
                            {article.journal}
                          </td>
                        )}
                        {visibleColumns.year && (
                          <td className="py-2 px-4 border-b">{article.year}</td>
                        )}
                        {visibleColumns.doi && (
                          <td className="py-2 px-4 border-b">
                            <a
                              href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?lookfor=${article.doi}&type=AllFields`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {article.doi}
                            </a>
                          </td>
                        )}
                        {visibleColumns.publisher && (
                          <td className="py-2 px-4 border-b">
                            {article.publisher}
                          </td>
                        )}
                        {visibleColumns.rating && (
        <td className="py-2 px-4 border-b">
          <div className="flex flex-col gap-2">
            <span>
              {article.averageRating !== null
                ? `${article.averageRating}/10`
                : '?/10'}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={ratingsInput[article._id] || ''}
                onChange={(e) =>
                  handleRatingChange(article._id, e.target.value)
                }
                className="w-16 text-black p-1"
              />
              <Button size="sm" onClick={() => submitRating(article._id)}>
                Rate
              </Button>
            </div>
          </div>
        </td>
      )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
