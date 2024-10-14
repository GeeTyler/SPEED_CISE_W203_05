// __tests__/SearchPage.test.tsx

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react';
import SearchPage from '@/app/components/search-article/_components/SearchPage';
import useSearchArticles from '@/app/hooks/useSearchArticles'; // Import the hook

// Mock the custom hook
jest.mock('@/app/hooks/useSearchArticles');

describe('SearchPage', () => {
  const mockSearchArticles = useSearchArticles as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('renders articles fetched from the API', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'Article 1',
        authors: 'Author 1',
        journal: 'Journal 1',
        year: '2022',
        publisher: 'Publisher 1',
        doi: '10.1000/182',
      },
      {
        _id: '2',
        title: 'Article 2',
        authors: 'Author 2',
        journal: 'Journal 2',
        year: '2021',
        publisher: 'Publisher 2',
        doi: '10.1000/183',
      },
    ];

    // Mock the resolved value of the API call
    mockSearchArticles.mockReturnValue({
      searchArticles: jest.fn().mockResolvedValue(mockArticles),
    });

    await act(async () => {
      render(<SearchPage />);
    });

    // Check that the articles appear on the page
    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Article 2')).toBeInTheDocument();
    });
  });

  it('displays an error message when the API call fails', async () => {
    // Mock the rejected value of the API call
    mockSearchArticles.mockReturnValue({
      searchArticles: jest.fn().mockRejectedValue(new Error('Error fetching articles')),
    });

    await act(async () => {
      render(<SearchPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Error fetching articles.')).toBeInTheDocument();
    });
  });

  it('displays "No results found" when no articles are returned', async () => {
    // Mock the resolved value with an empty array
    mockSearchArticles.mockReturnValue({
      searchArticles: jest.fn().mockResolvedValue([]),
    });

    await act(async () => {
      render(<SearchPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('No results found. Please try another search.')).toBeInTheDocument();
    });
  });

  it('fetches articles based on DOI input', async () => {
    const mockArticles = [
      {
        _id: '1',
        title: 'Article 1',
        authors: 'Author 1',
        journal: 'Journal 1',
        year: '2022',
        publisher: 'Publisher 1',
        doi: '10.1000/182',
      },
    ];

    mockSearchArticles.mockReturnValue({
      searchArticles: jest.fn().mockResolvedValue(mockArticles),
    });

    await act(async () => {
      render(<SearchPage />);
    });

    const input = screen.getByPlaceholderText('Search for...');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: '10.1000/182' } }); // Change DOI input
    fireEvent.click(button); // Click the search button

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument(); // Check if the article appears
    });
  });
});
