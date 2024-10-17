import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModeratorNotificationDropdown from '@/app/components/moderator-dashboard/_components/moderatorNotificationDropdown';
import ArticlesTable from '@/app/components/moderator-dashboard/_components/ArticlesTable';
import { useApproveArticle } from '@/app/hooks/useApproveArticle';
import { useRejectArticle } from '@/app/hooks/useRejectArticle';
import useNotifications from '@/app/hooks/useNotifications';

jest.mock('@/app/hooks/useApproveArticle');
jest.mock('@/app/hooks/useRejectArticle');
jest.mock('@/app/hooks/useNotifications');

describe('ModeratorDashboardPage', () => {
  const mockNotifications = [
    { _id: '1', message: 'New article submitted', createdAt: new Date().toISOString() },
    { _id: '2', message: 'Another article submitted', createdAt: new Date().toISOString() },
  ];

  const mockArticles = [
    {
      _id: '1',
      title: 'Test Article 1',
      authors: 'Author 1',
      journal: 'Journal 1',
      year: 2021,
      doi: '10.1000/test1',
      publisher: 'Publisher 1',
      submittedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Test Article 2',
      authors: 'Author 2',
      journal: 'Journal 2',
      year: 2022,
      doi: '10.1000/test2',
      publisher: 'Publisher 2',
      submittedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (useNotifications as jest.Mock).mockReturnValue(mockNotifications);
    (useApproveArticle as jest.Mock).mockReturnValue({
      handleApprove: jest.fn(),
    });
    (useRejectArticle as jest.Mock).mockReturnValue({
      handleReject: jest.fn(),
    });
  });

  it('renders the notification dropdown with unread notifications', () => {
    render(<ModeratorNotificationDropdown />);

    expect(screen.getByText('!')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('!'));

    expect(screen.getByText('New article submitted')).toBeInTheDocument();
    expect(screen.getByText('Another article submitted')).toBeInTheDocument();
  });

  it('renders the articles table with correct articles', () => {
    render(<ArticlesTable articles={mockArticles} showActions={true} onArticleUpdate={jest.fn()} />);
  
    const articleTitles = screen.getAllByText('Test Article 1');
    expect(articleTitles.length).toBeGreaterThan(0);
    expect(articleTitles[0]).toBeInTheDocument();
  
    const authors = screen.getAllByText('Author 1');
    expect(authors.length).toBeGreaterThan(0);
    expect(authors[0]).toBeInTheDocument();
  
    const journals1 = screen.getAllByText('Journal 1');
    expect(journals1.length).toBeGreaterThan(0);
    expect(journals1[0]).toBeInTheDocument();
  
    const articleTitles2 = screen.getAllByText('Test Article 2');
    expect(articleTitles2.length).toBeGreaterThan(0);
    expect(articleTitles2[0]).toBeInTheDocument();
  
    const authors2 = screen.getAllByText('Author 2');
    expect(authors2.length).toBeGreaterThan(0);
    expect(authors2[0]).toBeInTheDocument();
  
    const journals2 = screen.getAllByText('Journal 2');
    expect(journals2.length).toBeGreaterThan(0);
    expect(journals2[0]).toBeInTheDocument();
  });

  it('handles article approval', async () => {
    const mockApprove = jest.fn();
    (useApproveArticle as jest.Mock).mockReturnValue({
      handleApprove: mockApprove,
    });

    render(<ArticlesTable articles={mockArticles} showActions={true} onArticleUpdate={jest.fn()} />);

    const approveButton = screen.getAllByText('Approve')[0];
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(mockApprove).toHaveBeenCalledWith('1');
    });
  });

  it('handles article rejection', async () => {
    const mockReject = jest.fn();
    (useRejectArticle as jest.Mock).mockReturnValue({
      handleReject: mockReject,
    });

    render(<ArticlesTable articles={mockArticles} showActions={true} onArticleUpdate={jest.fn()} />);

    const rejectButton = screen.getAllByText('Reject')[0];
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(mockReject).toHaveBeenCalledWith('1');
    });
  });

  it('displays "No notifications" when there are no notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue([]);

    render(<ModeratorNotificationDropdown />);

    fireEvent.click(screen.getByText('!'));

    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });
});
