import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleDetail from '@/app/components/analyst-dashboard/_components/ArticleDetail';
import useAnalystArticle from '@/app/hooks/useAnalystArticle';
import useSubmitClaim from '@/app/hooks/useSubmitClaim';

jest.mock('@/app/hooks/useAnalystArticle');
jest.mock('@/app/hooks/useSubmitClaim');

const mockUseAnalystArticle = useAnalystArticle as jest.MockedFunction<typeof useAnalystArticle>;
const mockUseSubmitClaim = useSubmitClaim as jest.MockedFunction<typeof useSubmitClaim>;

describe('ArticleDetail', () => {
  const article = {
    _id: '1',
    title: 'Test Article',
    authors: 'John Doe',
    journal: 'Test Journal',
    year: 2021,
    doi: '10.1234/test',
    publisher: 'Test Publisher',
    submittedAt: '2021-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockUseAnalystArticle.mockReturnValue({
      article,
      loading: false,
      error: null,
    });

    mockUseSubmitClaim.mockReturnValue({
      submitClaim: jest.fn(),
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders article details correctly', () => {
    render(<ArticleDetail articleId="1" />);

    expect(screen.getByText('Test Article')).not.toBeNull();
    expect(screen.getByText('John Doe')).not.toBeNull();
    expect(screen.getByText('Test Journal')).not.toBeNull();
    expect(screen.getByText('2021')).not.toBeNull();
    expect(screen.getByText('10.1234/test')).not.toBeNull();
    expect(screen.getByText('Test Publisher')).not.toBeNull();
    
    expect(screen.getByText((content) => content.includes('1/1/2021'))).not.toBeNull();
  });

  it('shows validation error when claim is empty', async () => {
    render(<ArticleDetail articleId="1" />);

    fireEvent.change(screen.getByLabelText(/claim/i), { target: { value: '' } });
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Claim cannot be empty or just whitespace.')).not.toBeNull();
    });
  });

  it('submits claim successfully', async () => {
    const mockSubmitClaim = jest.fn();
    mockUseSubmitClaim.mockReturnValue({
      submitClaim: mockSubmitClaim,
      loading: false,
      error: null,
    });

    render(<ArticleDetail articleId="1" />);

    fireEvent.change(screen.getByLabelText(/claim/i), { target: { value: 'Test Claim' } });
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmitClaim).toHaveBeenCalledWith({
        _id: '1',
        title: 'Test Article',
        authors: 'John Doe',
        journal: 'Test Journal',
        year: 2021,
        doi: '10.1234/test',
        publisher: 'Test Publisher',
        submittedAt: '2021-01-01T00:00:00Z',
        claim: 'Test Claim',
      });
      expect(screen.getByText('Submission successful!')).not.toBeNull();
    });
  });

  it('shows error message on submission failure', async () => {
    const mockSubmitClaim = jest.fn().mockRejectedValue(new Error('Submission failed'));
    mockUseSubmitClaim.mockReturnValue({
      submitClaim: mockSubmitClaim,
      loading: false,
      error: 'Error submitting claim',
    });

    render(<ArticleDetail articleId="1" />);

    fireEvent.change(screen.getByLabelText(/claim/i), { target: { value: 'Test Claim' } });
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSubmitClaim).toHaveBeenCalled();
      expect(screen.getByText('Error submitting claim')).not.toBeNull();
    });
  });
});
