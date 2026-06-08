import { useCallback, useEffect, useState } from 'react';

export const useRecentNotifications = (userId, currentPage) => {
  const [recentNotifications, setRecentNotifications] = useState([]);

  const fetchRecentNotifications = useCallback(async () => {
    if (userId === undefined || userId === null) {
      return;
    }

    try {
      const response = await fetch(`/receivedMessages/${userId}?page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent notifications');
      }
      const data = await response.json();
      setRecentNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
    }
  }, [currentPage, userId]);

  useEffect(() => {
    fetchRecentNotifications();
  }, [fetchRecentNotifications]);

  return { recentNotifications, fetchRecentNotifications };
};
