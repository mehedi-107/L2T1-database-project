import React, { useState, useEffect } from 'react';
import './Notification.css'; // Import CSS file for styling

const Notification = ({ nurseId, onClose }) => {
  const [message, setMessage] = useState('');
  const [to, setTo] = useState('');
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(4); // Display 4 notifications per page

  useEffect(() => {
    // Fetch recent notifications from the server when the component mounts or currentPage changes
    fetchRecentNotifications();
  }, [currentPage]);

  const fetchRecentNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:5000/receivedMessages/${nurseId}?page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent notifications');
      }
      const data = await response.json();
      console.log('Recent notifications:', data.notifications);
      setRecentNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handleSend = async () => {
    try {
      const response = await fetch('http://localhost:5000/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: nurseId, // Replace 'User' with the actual sender ID or name
          to: to,
          message: message,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      // If the message is successfully sent, clear the message input and fetch updated notifications
      setMessage('');
      fetchRecentNotifications();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleDeleteNotification = async (index) => {
    const notificationToDelete = recentNotifications[index];
    try {
      const response = await fetch('http://localhost:5000/deleteMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationToDelete),
      });
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      fetchRecentNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = recentNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

  return (
    <div className="notification-container">
      <div className="recent-notifications">
        <h3>Recent Notifications:</h3>
        <ul>
          {currentNotifications.map((notification, index) => (
            <li key={index}>
              <p>Date: {notification.DATE}</p>
              <p>Time: {notification.TIME}</p>
              {notification.FROM === 0 ? <p>From: Admin</p> : <p>From: {notification.FROM} </p>}
              <p>Message: {notification.MESSAGE}</p>
              <button onClick={() => handleDeleteNotification(index)}>Delete</button>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={currentNotifications.length < notificationsPerPage}>Next</button>
        </div>
      </div>
      <div className="notification">
        <input
          className="to-input"
          type="text"
          placeholder="To"
          value={to}
          onChange={handleToChange}
        />
        <textarea
          className="message-input"
          placeholder="Type your message here..."
          value={message}
          onChange={handleMessageChange}
        ></textarea>
        <button onClick={handleSend}>Send</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Notification;
