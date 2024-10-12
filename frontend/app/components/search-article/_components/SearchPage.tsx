'use client';

import React, { useState } from 'react';
import useSearchArticles from '@/app/hooks/useSearchArticles';
import useRateArticle from '@/app/hooks/useRateArticle';
import Label from '@/app/ui/Label';
import Input from '@/app/ui/Input';
import Button from '@/app/ui/Button';

const SearchPage: React.FC = () => {
  const [doi, setDoi] = useState(''); // State for DOI input
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const { searchArticles } = useSearchArticles();
  const { rateArticle } = useRateArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoResults(false);

    // Validate DOI input
    if (!doi) {
      setError('DOI is required.');
      return;
    }

    console.log("Submitting form with DOI:", doi);

    try {
      const results = await searchArticles({ doi }); // Fetch articles based on DOI
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
            <Label htmlFor="doi" text="Enter DOI" />
            <Input
              id="doi"
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              required
              placeholder="e.g., 10.1145/2601248.2601267"
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
              <li key={article._id} className="border p-4 mb-2">
                <h3 className="text-md font-medium">{article.title}</h3>
                <p>{article.authors}</p>
                <p>{article.journal} - {article.year}</p>
                <p>Publisher: {article.publisher}</p>
                <p>DOI: <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">{article.doi}</a></p>

                <div className="mt-2">
                  <span className="mr-2">Rate this article:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(article._id, star)}
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
