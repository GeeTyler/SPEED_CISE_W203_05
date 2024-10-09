'use client';

import React, { useState } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles';
import useRateArticle from '@/app/hooks/useRateArticle';
import Label from '@/app/ui/Label';
import Input from '@/app/ui/Input';
import Button from '@/app/ui/Button';
import Select from '@/app/ui/Select';

const SearchPage: React.FC = () => {
  const [method, setMethod] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const { searchArticles } = useSearchArticles();
  const { rateArticle } = useRateArticle();

  console.log("Loading state from hook:");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoResults(false);

    const parsedStartYear = parseInt(startYear, 10);
    const parsedEndYear = parseInt(endYear, 10);

    if (parsedStartYear > parsedEndYear) {
      setError('Start Year must be less than or equal to End Year.');
      return;
    }

    const searchParams = {
      method,
      startYear: parsedStartYear,
      endYear: parsedEndYear,
    };

    // Add the console log here
    console.log("Submitting form with values:", searchParams);

    try {
      const results = await searchArticles(searchParams);
      if (results.length === 0) {
        setNoResults(true);
      } else {
        setArticles(results);
      }
    } catch (error) {
      setError('Error fetching articles.');
      console.error('Error fetching articles:', error);
    }
  };

  const handleRating = async (articleId: string, rating: number) => {
    try {
      await rateArticle({ articleId, rating });
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className="flex justify-center items-center w-1000 m-auto max-md:w-11/12">
      <div className="py-6 rounded shadow flex items-center w-full justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <Label htmlFor="method" text="Software Engineering Method" />
            <Select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
            >
              <option value="">Select SE Method</option>
              <option value="TDD">Test-Driven Development (TDD)</option>
              <option value="CI">Continuous Integration (CI)</option>
              {/* Add more SE methods here */}
            </Select>
          </div>
          <div>
            <Label htmlFor="startYear" text="Start Year" />
            <Input
              id="startYear"
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              required
              placeholder="e.g., 2010"
              min={1000}
              max={9999}
            />
          </div>
          <div>
            <Label htmlFor="endYear" text="End Year" />
            <Input
              id="endYear"
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              required
              placeholder="e.g., 2023"
              min={1000}
              max={9999}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {noResults && (
        <div className="mt-6 w-full text-center text-red-500">
          No results found. Please try another search.
        </div>
      )}

      {articles.length > 0 && (
        <div className="mt-6 w-full">
          <h2 className="text-lg font-bold">Search Results</h2>
          <ul>
            {articles.map((article) => (
              <li key={article.id} className="border p-4 mb-2">
                <h3 className="text-md font-medium">{article.title}</h3>
                <p>{article.authors}</p>
                <p>{article.journal} - {article.year}</p>
                <p>Publisher: {article.publisher}</p>
                <p>DOI: {article.doi}</p>

                <div className="mt-2">
                  <span className="mr-2">Rate this article:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(article.id, star)}
                      className="text-yellow-500"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
