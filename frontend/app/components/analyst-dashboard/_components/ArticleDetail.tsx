import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useAnalystArticle from '@/app/hooks/useAnalystArticle';
import useSubmitClaim from '@/app/hooks/useSubmitClaim';

interface ArticleDetailProps {
  articleId: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId }) => {
  const { article, loading: articleLoading, error: articleError } = useAnalystArticle(articleId);
  const { submitClaim, loading: claimLoading, error: claimError } = useSubmitClaim();
  const [claim, setClaim] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClaim(e.target.value);
    if (validationError) {
      setValidationError(null); // Clear validation error on change
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) {
      setValidationError('Claim cannot be empty or just whitespace.');
      return;
    }
    if (article) {
      try {
        await submitClaim({
          _id: article._id,
          title: article.title,
          authors: article.authors,
          journal: article.journal,
          year: article.year,
          doi: article.doi,
          publisher: article.publisher,
          submittedAt: article.submittedAt,
          claim,
        });
        setSuccessMessage('Submission successful!');
        setClaim(''); // Clear the claim input
      } catch {
        setValidationError('Error submitting claim.');
      }
    }
  };

  if (articleLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (articleError) {
    return <div className="text-center py-10 text-red-600">{articleError}</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-white">{article?.title}</h1>
      <div className="mb-4">
        <p className="mb-2"><strong>Authors:</strong> {article?.authors}</p>
        <p className="mb-2"><strong>Journal:</strong> {article?.journal}</p>
        <p className="mb-2"><strong>Year:</strong> {article?.year}</p>
        <p className="mb-2"><strong>DOI:</strong> {article?.doi}</p>
        <p className="mb-2"><strong>Publisher:</strong> {article?.publisher}</p>
        <p className="mb-4"><strong>Submitted:</strong> {new Date(article?.submittedAt).toLocaleString()}</p>
      </div>
      
      <a
        href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article?.doi}&type=AllFields`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <FaSearch className="mr-2" />
        Find Article
      </a>

      {successMessage ? (
        <div className="text-green-500 text-lg font-medium text-center">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-6">
            <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-2">
              Claim
            </label>
            <textarea
              id="claim"
              name="claim"
              value={claim}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
              placeholder="Enter your claim here..."
            />
            {validationError && <p className="mt-2 text-sm text-red-600">{validationError}</p>}
          </div>
          <button
            type="submit"
            disabled={claimLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      )}
      {claimError && <p className="mt-4 text-sm text-red-600">{claimError}</p>}
    </div>
  );
};

export default ArticleDetail;