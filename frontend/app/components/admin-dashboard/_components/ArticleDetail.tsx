import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSpeedArticle from '@/app/hooks/useSpeedArticle';
import useUpdateArticle from '@/app/hooks/useUpdateArticle';
import useDeleteArticle from '@/app/hooks/useDeleteArticle';

interface ArticleDetailProps {
  articleId: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId }) => {
  const router = useRouter();
  const { article, loading: articleLoading, error: articleError } = useSpeedArticle(articleId);
  const { updateArticle, loading: updateLoading, error: updateError } = useUpdateArticle();
  const { deleteArticle, loading: deleteLoading, error: deleteError } = useDeleteArticle();
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState(article);
  const [originalArticle, setOriginalArticle] = useState(article);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setEditedArticle(article);
    setOriginalArticle(article);
  }, [article]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editedArticle.title) newErrors.title = 'Title is required';
    if (!editedArticle.authors) newErrors.authors = 'Authors are required';
    if (!editedArticle.journal) newErrors.journal = 'Journal is required';
    if (!editedArticle.year || !/^\d{4}$/.test(editedArticle.year.toString())) newErrors.year = 'Valid year is required (e.g., 2023)';
    if (!editedArticle.doi) newErrors.doi = 'DOI is required';
    if (!editedArticle.publisher) newErrors.publisher = 'Publisher is required';
    if (!editedArticle.claim) newErrors.claim = 'Claim is required';
    return newErrors;
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedArticle({ ...editedArticle, [name]: value });

    // Clear the specific error if the field is valid
    const newErrors = { ...errors };
    if (name === 'year' && /^\d{4}$/.test(value)) {
      delete newErrors.year;
    } else if (value) {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedArticle(originalArticle);
      setErrors({});
    }
  };

  const handleUpdateArticle = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await updateArticle(articleId, editedArticle);
    setOriginalArticle(editedArticle);
    setIsEditing(false);
    setSuccessMessage('Article was successfully edited.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteArticle = async () => {
    await deleteArticle(articleId);
    setSuccessMessage('Article was successfully deleted.');
    setTimeout(() => {
      setSuccessMessage(null);
      router.push('/components/admin-dashboard');
    }, 3000);
  };

  if (articleLoading || updateLoading || deleteLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (articleError || updateError || deleteError) {
    return <div className="text-center py-10 text-red-600">{articleError || updateError || deleteError}</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      {successMessage && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-white">{editedArticle?.title}</h1>
      <div className="mb-4">
        <p className="mb-2">
          <strong>Authors:</strong>{' '}
          <span
            contentEditable={isEditing}
            className={isEditing ? 'editable' : ''}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleEditChange({ target: { name: 'authors', value: e.currentTarget.textContent || '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          >
            {editedArticle?.authors}
          </span>
          {errors.authors && <span className="text-red-500">{errors.authors}</span>}
        </p>
        <p className="mb-2">
          <strong>Journal:</strong>{' '}
          <span
            contentEditable={isEditing}
            className={isEditing ? 'editable' : ''}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleEditChange({ target: { name: 'journal', value: e.currentTarget.textContent || '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          >
            {editedArticle?.journal}
          </span>
          {errors.journal && <span className="text-red-500">{errors.journal}</span>}
        </p>
        <p className="mb-2">
          <strong>Year:</strong>{' '}
          <span
            contentEditable={isEditing}
            className={isEditing ? 'editable' : ''}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleEditChange({ target: { name: 'year', value: e.currentTarget.textContent || '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          >
            {editedArticle?.year}
          </span>
          {errors.year && <span className="text-red-500">{errors.year}</span>}
        </p>
        <p className="mb-2">
          <strong>DOI:</strong>{' '}
          <span
            contentEditable={isEditing}
            className={isEditing ? 'editable' : ''}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleEditChange({ target: { name: 'doi', value: e.currentTarget.textContent || '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          >
            {editedArticle?.doi}
          </span>
          {errors.doi && <span className="text-red-500">{errors.doi}</span>}
        </p>
        <p className="mb-2">
          <strong>Publisher:</strong>{' '}
          <span
            contentEditable={isEditing}
            className={isEditing ? 'editable' : ''}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleEditChange({ target: { name: 'publisher', value: e.currentTarget.textContent || '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          >
            {editedArticle?.publisher}
          </span>
          {errors.publisher && <span className="text-red-500">{errors.publisher}</span>}
        </p>
        <p className="mb-2">
          <strong>Claim:</strong>{' '}
          <span
            contentEditable={isEditing}
            className={isEditing ? 'editable' : ''}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleEditChange({ target: { name: 'claim', value: e.currentTarget.textContent || '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          >
            {editedArticle?.claim}
          </span>
          {errors.claim && <span className="text-red-500">{errors.claim}</span>}
        </p>
        <p className="mb-4">
          <strong>Submitted:</strong> {new Date(editedArticle?.submittedAt).toLocaleString()}
        </p>
      </div>
      <a
        href={`https://librarysearch.aut.ac.nz/vufind/EDS/Search?filter%5B%5D=EXPAND%3A"fulltext"&filter%5B%5D=LIMIT%7CFT%3A"y"&dfApplied=1&lookfor=${article?.doi}&type=AllFields`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View Full Text
      </a>
      {isEditing ? (
        <div>
          <button
            onClick={handleUpdateArticle}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={handleEditToggle}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleEditToggle}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteArticle}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;