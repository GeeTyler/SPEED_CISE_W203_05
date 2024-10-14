'use client';

import React, { useState, useEffect } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles'; 
import Label from '@/app/ui/Label';
import Input from '@/app/ui/Input';
import Button from '@/app/ui/Button';

const SearchPage: React.FC = () => {
  const [doi, setDoi] = useState(''); // State for DOI input
  const [articles, setArticles] = useState<any[]>([]); // Initialize articles as an empty array
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [isGridView, setIsGridView] = useState(false); // State for toggling between views
  const { searchArticles } = useSearchArticles();

  // Function to fetch all articles
  const fetchAllArticles = async () => {
    setLoading(true);
    try {
      const results = await searchArticles({}); // Fetch all articles from API
      setArticles(results);
      setNoResults(results.length === 0);
      setError(null);
    } catch (error) {
      setError('Error fetching articles.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all articles on component mount
  useEffect(() => {
    fetchAllArticles(); // Automatically fetch all articles on load
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoResults(false);
    setLoading(true); // Start loading state

    try {
      if (!doi.trim()) {
        fetchAllArticles(); // Fetch all articles if DOI input is empty
      } else {
        const results = await searchArticles({ doi }); // Fetch articles based on DOI
        setNoResults(results.length === 0);
        setArticles(results);
      }
      setDoi(''); // Clear DOI input after submission
    } catch (error) {
      setError('Error fetching articles.');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle toggling between grid and table view
  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="flex flex-col justify-center items-center w-[1200px] m-auto max-md:w-11/12">
      <div className="py-6 rounded shadow flex items-center w-full justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>

            <Input
              id="search"
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="Search for..." // Updated placeholder to match the test
            />
          </div>
          <Button type="submit">{loading ? 'Searching...' : 'Search'}</Button>
        </form>
      </div>

      {loading && <div className="mt-6">Loading articles...</div>} {/* Loading indicator */}

      {/* View Toggle Button */}
      <div className="my-4">
        <Button onClick={toggleView}>
          Switch to {isGridView ? 'Table' : 'Grid'} View
        </Button>
      </div>

      <div className="mt-6 w-full">
        {noResults && (
          <div className="text-center text-red-500">
            No results found. Please try another search.
          </div>
        )}

        <h1 className="text-lg font-bold">Search Results</h1>

        {Array.isArray(articles) && articles.length > 0 && (
          <>
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                  <div key={article._id} className="border p-4 rounded-lg shadow-lg">
                    <h3 className="font-semibold mb-2">{article.title}</h3>
                    <p className="text-sm"><strong>Authors: </strong>{article.authors}</p>
                    <p className="text-sm"><strong>Journal: </strong>{article.journal}</p>
                    <p className="text-sm"><strong>Year: </strong>{article.year}</p>
                    <p className="text-sm"><strong>DOI: </strong>{article.doi}</p>
                    <p className="text-sm"><strong>Publisher: </strong>{article.publisher}</p>
                    <p className="text-sm"><strong>Submitted At: </strong>{new Date(article.submittedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-indigo-600 rounded-lg">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-4 border-b border-indigo-600">Title</th>
                      <th className="text-right py-2 px-4 border-b border-indigo-600">Authors</th>
                      <th className="text-right py-2 px-4 border-b border-indigo-600">Journal</th>
                      <th className="text-right py-2 px-4 border-b border-indigo-600">Year</th>
                      <th className="text-right py-2 px-4 border-b border-indigo-600">DOI</th>
                      <th className="text-right py-2 px-4 border-b border-indigo-600">Publisher</th>
                      <th className="text-right py-2 px-4 border-b border-indigo-600">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article._id}>
                        <td className="py-2 px-4 border-b border-indigo-600">{article.title}</td>
                        <td className="py-2 px-4 border-b border-indigo-600 text-right">{article.authors}</td>
                        <td className="py-2 px-4 border-b border-indigo-600 text-right">{article.journal}</td>
                        <td className="py-2 px-4 border-b border-indigo-600 text-right">{article.year}</td>
                        <td className="py-2 px-4 border-b border-indigo-600 text-right">{article.doi}</td>
                        <td className="py-2 px-4 border-b border-indigo-600 text-right">{article.publisher}</td>
                        <td className="py-2 px-4 border-b border-indigo-600 text-right">{new Date(article.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
