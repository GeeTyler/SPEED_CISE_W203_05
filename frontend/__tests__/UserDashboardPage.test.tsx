import { render, screen } from '@testing-library/react';
import UserDashboardPage from '@/app/components/user-dashboard/page';
import { useModeratorArticles } from '@/app/hooks/useModeratorArticles';
import { useAnalystArticles } from '@/app/hooks/useAnalystArticles';
import NotificationDropdown from '@/app/ui/notificationdropdown/notificationdropdown';

jest.mock('@/app/hooks/useModeratorArticles');
jest.mock('@/app/hooks/useAnalystArticles');
jest.mock('@/app/ui/notificationdropdown/notificationdropdown');

describe('UserDashboardPage', () => {
  beforeEach(() => {
    (useModeratorArticles as jest.Mock).mockReturnValue({
      moderatorArticles: [],
    });
    (useAnalystArticles as jest.Mock).mockReturnValue({
      analystArticles: [],
    });
    (NotificationDropdown as jest.Mock).mockReturnValue(<div>Mocked Notification Dropdown</div>);
  });

  it('should render UserDashboardPage with moderator and analyst articles', () => {
    render(<UserDashboardPage />);

    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Articles Under Moderator Review')).toBeInTheDocument();
    expect(screen.getByText('Articles Under Analyst Review')).toBeInTheDocument();
    expect(screen.getByText('Mocked Notification Dropdown')).toBeInTheDocument();
  });
});
