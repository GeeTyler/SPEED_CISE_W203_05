import { useState } from 'react';
import useNotifications from '@/app/hooks/useNotifications';

const AnalystNotificationDropdown: React.FC = () => {
  const notifications = useNotifications('analyst');
  const [isOpen, setIsOpen] = useState(false);

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const displayedNotifications = sortedNotifications.slice(0, 5);
  const unreadCount = Math.min(notifications.length, 5);

  return (
    <div className="relative inline-block">
      <button
        className="relative bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        !
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-white text-green-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-300 border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {displayedNotifications.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No notifications</li>
            ) : (
              displayedNotifications.map((notification) => (
                <li key={notification._id} className="px-4 py-2 border-b last:border-0 text-black">
                  {notification.message}
                  <div className="text-xs text-gray-600">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalystNotificationDropdown;
