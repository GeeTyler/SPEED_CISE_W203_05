import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleDetail from '@/app/components/admin-dashboard/_components/ArticleDetail';

const mockArticle = {
  _id: '1',
  title: 'Sample Article',
  authors: 'Author 1, Author 2',
  journal: 'Sample Journal',
  year: 2024,
  doi: '10.1234/example',
  publisher: 'Sample Publisher',
  submittedAt: new Date().toISOString(),
  claim: 'Sample Claim',
};

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/app/hooks/useSpeedArticle', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    article: mockArticle,
    loading: false,
    error: null,
  })),
}));

jest.mock('@/app/hooks/useUpdateArticle', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    updateArticle: jest.fn(),
    loading: false,
    error: null,
  })),
}));

jest.mock('@/app/hooks/useDeleteArticle', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    deleteArticle: jest.fn().mockImplementation(() => {
      mockPush('/admin-dashboard');
      return Promise.resolve({});
    }),
    loading: false,
    error: null,
  })),
}));

describe('ArticleDetail', () => {
  it('renders article details', () => {
    render(<ArticleDetail articleId="1" />);

    expect(screen.getByText('Sample Article')).toBeTruthy();
    expect(screen.getByText('Author 1, Author 2')).toBeTruthy();
    expect(screen.getByText('Sample Journal')).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('10.1234/example')).toBeTruthy();
    expect(screen.getByText('Sample Publisher')).toBeTruthy();
  });

  it('allows editing of article details', async () => {
    render(<ArticleDetail articleId="1" />);

    fireEvent.click(screen.getByText('Edit'));

    const titleElement = screen.getByText('Sample Article');
    fireEvent.input(titleElement, { target: { textContent: 'Updated Article' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Updated Article')).toBeTruthy();
    });
  });

  it('allows deletion of article', async () => {
    render(<ArticleDetail articleId="1" />);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin-dashboard');
    });
  });
});
