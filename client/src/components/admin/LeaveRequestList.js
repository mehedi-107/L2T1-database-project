import React, { useState, useEffect } from 'react';
import LeaveRequestItem from './LeaveRequestItem';

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/leaveRequests');
        if (!response.ok) {
          throw new Error('Failed to fetch leave requests');
        }
        const data = await response.json();
        setLeaveRequests(data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRequests();
  }, []);

  const handleApprove = async (id) => {
    // Logic to approve leave request
    console.log('Approving leave request with ID:', id);
  };

  const handleReject = async (id) => {
    // Logic to reject leave request
    console.log('Rejecting leave request with ID:', id);
  };

  return (
    <div>
      <h2>Leave Requests</h2>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <ul>
          {leaveRequests.map(request => (
            <LeaveRequestItem
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaveRequestList;
