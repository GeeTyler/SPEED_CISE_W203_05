import { render, screen, fireEvent } from '@testing-library/react';
import AnalystDashboard from '@/app/components/analyst-dashboard/page';
import AnalystNotificationDropdown from '@/app/components/analyst-dashboard/_components/analystNotificationDropdown';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';
import useNotifications from '@/app/hooks/useNotifications';

jest.mock('@/app/hooks/useAnalystArticles');
jest.mock('@/app/hooks/useNotifications');
jest.mock('axios');

describe('AnalystDashboardPage', () => {
  const mockNotifications = [
    { _id: '1', message: 'New analyst article submitted', createdAt: new Date().toISOString() },
    { _id: '2', message: 'Another analyst article submitted', createdAt: new Date().toISOString() },
  ];

  const mockArticles = [
    {
      _id: '1',
      title: 'Analyst Article 1',
      authors: 'Author 1',
      journal: 'Journal 1',
      year: 2021,
      doi: '10.1000/analyst1',
      publisher: 'Publisher 1',
      submittedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Analyst Article 2',
      authors: 'Author 2',
      journal: 'Journal 2',
      year: 2022,
      doi: '10.1000/analyst2',
      publisher: 'Publisher 2',
      submittedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (useNotifications as jest.Mock).mockReturnValue(mockNotifications);
    (useAnalystArticles as jest.Mock).mockReturnValue({
      analystArticles: mockArticles,
      fetchAnalystArticles: jest.fn(), 
    });
  });

  it('renders the AnalystDashboard with notifications and articles', () => {
    render(<AnalystDashboard />);
  
    expect(screen.getByText('Analyst Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analyst Queue Articles')).toBeInTheDocument();
  
    const articleTitles1 = screen.getAllByText('Analyst Article 1');
    expect(articleTitles1.length).toBeGreaterThan(0);
    expect(articleTitles1[0]).toBeInTheDocument();
  
    const articleTitles2 = screen.getAllByText('Analyst Article 2');
    expect(articleTitles2.length).toBeGreaterThan(0);
    expect(articleTitles2[0]).toBeInTheDocument();
  });

  it('renders the notification dropdown with unread notifications', () => {
    render(<AnalystNotificationDropdown />);

    expect(screen.getByText('!')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('!'));

    expect(screen.getByText('New analyst article submitted')).toBeInTheDocument();
    expect(screen.getByText('Another analyst article submitted')).toBeInTheDocument();
  });

  it('displays "No notifications" when there are no notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue([]);

    render(<AnalystNotificationDropdown />);

    fireEvent.click(screen.getByText('!'));

    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });

});
