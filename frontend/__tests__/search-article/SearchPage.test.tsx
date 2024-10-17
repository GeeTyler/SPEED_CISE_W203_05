// __tests__/SearchPage.test.tsx

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SearchPage from '@/app/components/search-article/_components/SearchPage';
import useSearchArticles from '@/app/hooks/useSearchArticles';
import axios from 'axios';

// Mock the custom hook and axios
jest.mock('@/app/hooks/useSearchArticles');
jest.mock('axios');

describe('SearchPage', () => {
  // Mock implementations
  const mockSearchArticlesFunction = jest.fn();
  const mockAxiosPost = axios.post as jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the useSearchArticles hook
    (useSearchArticles as jest.Mock).mockReturnValue({
      searchArticles: mockSearchArticlesFunction,
      error: null,
    });

    // Mock window.alert
    window.alert = jest.fn();
  });

  it('renders articles fetched from the API upon form submission', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'Article 1',
        authors: 'Author 1',
        journal: 'Journal 1',
        year: 2022,
        publisher: 'Publisher 1',
        doi: '10.1000/182',
        averageRating: 4.5,
      },
      {
        _id: '2',
        title: 'Article 2',
        authors: 'Author 2',
        journal: 'Journal 2',
        year: 2021,
        publisher: 'Publisher 2',
        doi: '10.1000/183',
        averageRating: null,
      },
    ];

    mockSearchArticlesFunction.mockResolvedValue(mockArticles);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    // Simulate user input and form submission
    fireEvent.change(input, { target: { value: 'search query' } });
    fireEvent.click(button);

    // Wait for the articles to be rendered
    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Article 2')).toBeInTheDocument();
    });

    // Ensure that the searchArticles function was called with correct parameters
    expect(mockSearchArticlesFunction).toHaveBeenCalledWith({ query: 'search query' });
  });

  it('displays an error message when the API call fails', async () => {
    mockSearchArticlesFunction.mockRejectedValue(new Error('Error fetching articles'));

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error fetching articles.')).toBeInTheDocument();
    });
  });

  it('displays "No articles found." when no articles are returned', async () => {
    mockSearchArticlesFunction.mockResolvedValue([]);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'notfound' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('No articles found.')).toBeInTheDocument();
    });
  });

  it('fetches articles based on DOI input', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'Article 1',
        authors: 'Author 1',
        journal: 'Journal 1',
        year: 2022,
        publisher: 'Publisher 1',
        doi: '10.1000/182',
        averageRating: 4.5,
      },
    ];

    mockSearchArticlesFunction.mockResolvedValue(mockArticles);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '10.1000/182' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    });

    expect(mockSearchArticlesFunction).toHaveBeenCalledWith({ query: '10.1000/182' });
  });

  it('allows users to submit ratings for an article', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'Article 1',
        authors: 'Author 1',
        journal: 'Journal 1',
        year: 2022,
        publisher: 'Publisher 1',
        doi: '10.1000/182',
        averageRating: '?/10', // Initially no rating
      },
    ];

    mockSearchArticlesFunction.mockResolvedValue(mockArticles);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    // Submit search
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Wait for articles to appear
    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    });

    // Enter rating
    const ratingInput = screen.getByRole('spinbutton');
    fireEvent.change(ratingInput, { target: { value: '8' } });

    // Mock axios POST response
    mockAxiosPost.mockResolvedValue({});

    // Submit rating
    const submitButton = screen.getByText(/Rate/i);
    fireEvent.click(submitButton);

    // Ensure axios.post was called with correct URL and data
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speed/1/rate`,
      { rating: 8 }
    );

    // Wait for the success alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Rating submitted successfully');
    });

    // Ensure that fetchArticles was called again to refresh articles
    expect(mockSearchArticlesFunction).toHaveBeenCalledTimes(2);
  });

  it('toggles between grid and table view', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'Article 1',
        authors: 'Author 1',
        journal: 'Journal 1',
        year: 2022,
        publisher: 'Publisher 1',
        doi: '10.1000/182',
        averageRating: 4.5,
      },
    ];

    mockSearchArticlesFunction.mockResolvedValue(mockArticles);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    // Submit search
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Wait for articles to appear
    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
    });

    // Initially table view should be present
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Toggle to grid view
    const toggleButton = screen.getByRole('button', { name: /switch to grid view/i });
    fireEvent.click(toggleButton);

    // Table should no longer be in the document
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    // Article should still be visible
    expect(screen.getByText('Article 1')).toBeInTheDocument();
  });

  it('applies filters to the displayed articles', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'React Testing',
        authors: 'Author A',
        journal: 'Journal A',
        year: 2022,
        publisher: 'Publisher A',
        doi: '10.1000/182',
        averageRating: 4.5,
      },
      {
        _id: '2',
        title: 'Vue Testing',
        authors: 'Author B',
        journal: 'Journal B',
        year: 2021,
        publisher: 'Publisher B',
        doi: '10.1000/183',
        averageRating: null,
      },
    ];

    mockSearchArticlesFunction.mockResolvedValue(mockArticles);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    // Submit search
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Wait for articles to appear
    await waitFor(() => {
      expect(screen.getByText('React Testing')).toBeInTheDocument();
      expect(screen.getByText('Vue Testing')).toBeInTheDocument();
    });

    // Apply title filter
    const titleFilter = screen.getByPlaceholderText('Filter by Title');
    fireEvent.change(titleFilter, { target: { value: 'react' } });

    // Article with 'Vue Testing' title should not be visible
    expect(screen.queryByText('Vue Testing')).not.toBeInTheDocument();
    expect(screen.getByText('React Testing')).toBeInTheDocument();

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    // Both articles should be visible again
    expect(screen.getByText('React Testing')).toBeInTheDocument();
    expect(screen.getByText('Vue Testing')).toBeInTheDocument();
  });

  it('toggles the visibility of columns', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'React Testing',
        authors: 'Author A',
        journal: 'Journal A',
        year: 2022,
        publisher: 'Publisher A',
        doi: '10.1000/182',
        averageRating: 4.5,
      },
    ];

    mockSearchArticlesFunction.mockResolvedValue(mockArticles);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: /search/i });

    // Submit search
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    // Wait for articles to appear
    await waitFor(() => {
      expect(screen.getByText('React Testing')).toBeInTheDocument();
    });

    // Deselect the 'Authors' column
    const authorsCheckbox = screen.getByLabelText('Authors');
    fireEvent.click(authorsCheckbox);

    // Authors column should no longer be in the document
    expect(screen.queryByText('Author A')).not.toBeInTheDocument();

    // Reselect the 'Authors' column
    fireEvent.click(authorsCheckbox);

    // Authors column should be visible again
    expect(screen.getByText('Author A')).toBeInTheDocument();
  });
});
