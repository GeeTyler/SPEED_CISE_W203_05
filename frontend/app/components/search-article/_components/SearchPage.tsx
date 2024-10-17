'use client';

import React, { useState } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles';
import Input from '@/app/ui/Input';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-col justify-center items-center w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* Search Form */}
        <div className="py-4 rounded shadow flex flex-col sm:flex-row items-center justify-center w-full">
          <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {error && <div className="text-red-500 text-sm mb-2 sm:mb-0">{error}</div>}
            <Input
              id="search"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for..."
              className="flex-1"
            />
            <Button type="submit" className="w-full sm:w-auto">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Loading Indicator */}
        {loading && <div className="mt-4 text-center">Loading articles...</div>}

        {/* Controls: View Toggle and Column Selector */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center my-4 space-y-4 sm:space-y-0">
          {/* View Toggle Button */}
          <Button onClick={toggleView} className="w-full sm:w-auto">
            Switch to {isGridView ? 'Table' : 'Grid'} View
          </Button>

          {/* Column Selector */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {Object.keys(visibleColumns).map((col) => (
              <label key={col} className="inline-flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={visibleColumns[col as keyof typeof visibleColumns]}
                  onChange={() => handleColumnToggle(col)}
                  className="form-checkbox h-4 w-4 text-indigo-600"
                />
                <span className="text-sm">{col.charAt(0).toUpperCase() + col.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-4 mb-6">
          <Input
            id="filter-title"
            placeholder="Filter by Title"
            value={filters.title}
            onChange={(e) => handleFilterChange(e, 'title')}
            className="text-black flex-1"
          />
          <Input
            id="filter-authors"
            placeholder="Filter by Authors"
            value={filters.authors}
            onChange={(e) => handleFilterChange(e, 'authors')}
            className="text-black flex-1"
          />
          <Input
            id="filter-journal"
            placeholder="Filter by Journal"
            value={filters.journal}
            onChange={(e) => handleFilterChange(e, 'journal')}
            className="text-black flex-1"
          />
          <Input
            id="filter-year"
            placeholder="Filter by Year"
            value={filters.year}
            onChange={(e) => handleFilterChange(e, 'year')}
            className="text-black flex-1"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-center sm:justify-end mb-6">
          <Button onClick={clearFilters} className="w-full sm:w-auto">
            Clear Filters
          </Button>
        </div>

        {/* Articles Display */}
        <div className="w-full">
          {filteredArticles.length > 0 ? (
            <>
              {isGridView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article._id}
                      className="border p-4 rounded-lg shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        {visibleColumns.title && (
                          <h3 className="font-semibold mb-2 text-lg">{article.title}</h3>
                        )}
                        {visibleColumns.authors && (
                          <p className="text-sm mb-1">
                            <strong>Authors: </strong>
                            {article.authors}
                          </p>
                        )}
                        {visibleColumns.journal && (
                          <p className="text-sm mb-1">
                            <strong>Journal: </strong>
                            {article.journal}
                          </p>
                        )}
                        {visibleColumns.year && (
                          <p className="text-sm mb-1">
                            <strong>Year: </strong>
                            {article.year}
                          </p>
                        )}
                        {visibleColumns.doi && (
                          <p className="text-sm mb-1">
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
                          <p className="text-sm mb-1">
                            <strong>Publisher: </strong>
                            {article.publisher}
                          </p>
                        )}
                      </div>
                      {visibleColumns.rating && (
                        <div className="mt-4">
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <span className="text-sm">
                              <strong>Rating: </strong>
                              {article.averageRating !== null
                                ? `${article.averageRating}/10`
                                : '?/10'}
                            </span>
                            <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={ratingsInput[article._id] || ''}
                                onChange={(e) =>
                                  handleRatingChange(article._id, e.target.value)
                                }
                                className="w-full sm:w-20 rounded-lg text-black text-right p-1"
                              />
                              <Button
                                onClick={() => submitRating(article._id)}
                                className="w-full sm:w-auto"
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
<div className="overflow-x-auto sm:overflow-x-visible sm:flex sm:justify-center">
  <table className="min-w-full border border-indigo-600 rounded-lg sm:max-w-4xl">
    <thead>
      <tr>
        {visibleColumns.title && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">Title</th>
        )}
        {visibleColumns.authors && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">Authors</th>
        )}
        {visibleColumns.journal && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">Journal</th>
        )}
        {visibleColumns.year && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">Year</th>
        )}
        {visibleColumns.doi && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">DOI</th>
        )}
        {visibleColumns.publisher && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">Publisher</th>
        )}
        {visibleColumns.rating && (
          <th className="text-left py-2 px-4 border-b border-indigo-600 text-sm">Rating</th>
        )}
      </tr>
    </thead>
    <tbody>
      {filteredArticles.map((article) => (
        <tr key={article._id} className="hover:bg-indigo-400">
          {visibleColumns.title && (
            <td className="py-2 px-4 border-b text-sm">{article.title}</td>
          )}
          {visibleColumns.authors && (
            <td className="py-2 px-4 border-b text-sm">{article.authors}</td>
          )}
          {visibleColumns.journal && (
            <td className="py-2 px-4 border-b text-sm">{article.journal}</td>
          )}
          {visibleColumns.year && (
            <td className="py-2 px-4 border-b text-sm">{article.year}</td>
          )}
          {visibleColumns.doi && (
            <td className="py-2 px-4 border-b text-sm">
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
            <td className="py-2 px-4 border-b text-sm">{article.publisher}</td>
          )}
          {visibleColumns.rating && (
            <td className="py-2 px-4 border-b text-sm">
              <div className="flex flex-col gap-2">
                <span>
                  {article.averageRating !== null
                    ? `${article.averageRating}/10`
                    : '?/10'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={ratingsInput[article._id] || ''}
                    onChange={(e) =>
                      handleRatingChange(article._id, e.target.value)
                    }
                    className="w-16 sm:w-20 text-black p-1 rounded"
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
            <p className="text-center">No articles found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
