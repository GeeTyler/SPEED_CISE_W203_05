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
  });

  // Filter states
  const [filters, setFilters] = useState({
    title: '',
    authors: '',
    journal: '',
    year: '',
  });

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
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value.toLowerCase(), // Update the filter for the specific field
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

  // Filtered articles based on filters state
  const filteredArticles = articles.filter((article) => {
    return (
      (!filters.title || article.title.toLowerCase().includes(filters.title)) &&
      (!filters.authors || article.authors.toLowerCase().includes(filters.authors)) &&
      (!filters.journal || article.journal.toLowerCase().includes(filters.journal)) &&
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
        {Array.isArray(filteredArticles) && filteredArticles.length > 0 && (
          <>
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <div key={article._id} className="border p-4 rounded-lg shadow-lg">
                    {visibleColumns.title && <h3 className="font-semibold mb-2">{article.title}</h3>}
                    {visibleColumns.authors && (
                      <p className="text-sm">
                        <strong>Authors: </strong>{article.authors}
                      </p>
                    )}
                    {visibleColumns.journal && (
                      <p className="text-sm">
                        <strong>Journal: </strong>{article.journal}
                      </p>
                    )}
                    {visibleColumns.year && (
                      <p className="text-sm">
                        <strong>Year: </strong>{article.year}
                      </p>
                    )}
                    {visibleColumns.doi && (
                      <p className="text-sm">
                        <strong>DOI: </strong>
                        <a
                          href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article?.doi}&type=AllFields`}
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
                        <strong>Publisher: </strong>{article.publisher}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-indigo-600 rounded-lg">
                  <thead>
                    <tr>
                      {visibleColumns.title && <th className="text-left py-2 px-4 border-b border-indigo-600">Title</th>}
                      {visibleColumns.authors && <th className="text-right py-2 px-4 border-b border-indigo-600">Authors</th>}
                      {visibleColumns.journal && <th className="text-right py-2 px-4 border-b border-indigo-600">Journal</th>}
                      {visibleColumns.year && <th className="text-right py-2 px-4 border-b border-indigo-600">Year</th>}
                      {visibleColumns.doi && <th className="text-right py-2 px-4 border-b border-indigo-600">DOI</th>}
                      {visibleColumns.publisher && <th className="text-right py-2 px-4 border-b border-indigo-600">Publisher</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article._id}>
                        {visibleColumns.title && <td className="py-2 px-4 border-b">{article.title}</td>}
                        {visibleColumns.authors && <td className="py-2 px-4 border-b">{article.authors}</td>}
                        {visibleColumns.journal && <td className="py-2 px-4 border-b">{article.journal}</td>}
                        {visibleColumns.year && <td className="py-2 px-4 border-b">{article.year}</td>}
                        {visibleColumns.doi && (
                          <td className="py-2 px-4 border-b border-indigo-600">
                            <a
                              href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article.doi}&type=AllFields`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {article.doi}
                            </a>
                          </td>
                        )}
                        {visibleColumns.publisher && <td className="py-2 px-4 border-b">{article.publisher}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {noResults && <p>No articles found.</p>}
      </div>
    </div>
  );
};

export default SearchPage;