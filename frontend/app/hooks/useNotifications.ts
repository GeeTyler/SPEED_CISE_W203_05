import { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  type: string;
}

const useNotifications = (type: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const commitHash = process.env.VERCEL_GIT_COMMIT_REF;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `https://speedcisew20305backend-git-${commitHash}-tyler-gees-projects-ab3c2f84.vercel.app`;
        const response = await axios.get(
          `${backendUrl}/api/notifications?type=${type}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return notifications;
};

export default useNotifications;
