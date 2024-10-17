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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications?type=${type}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [type]); // Added 'type' to the dependency array

  return notifications;
};

export default useNotifications;
