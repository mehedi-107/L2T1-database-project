import React, { useCallback, useState, useEffect } from 'react';
import './LeaveRequestList.css';

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [rejectMessage, setRejectMessage] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch('/displayLeaveApplications');
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

  const getPosition = useCallback((applicantId) => {
    return applicantId.toString().startsWith('3') ? 'Nurse' : 'Doctor';
  }, []);

  const handleApprove = async (id, position) => {
    setConfirmApproveId({ id, position });
  };
  
  const confirmApproveAction = async () => {
    const { id, position } = confirmApproveId;
    try {
      const response = await fetch(`/manage${position}Leave/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to approve leave');
      }
      const data = await response.json();
      // Set server message
      setServerMessage(position === 'Nurse' ? data.manage_nurse_leave : data.manage_doctor_leave);
      // Send notification to staff member
      sendMessage(id, 'Your leave application has been approved');
    } catch (error) {
      console.error('Error approving leave:', error);
    }
    setConfirmApproveId(null);
  };

  const handleReject = async (id) => {
    setConfirmRejectId(id);
  };

  const confirmRejectAction = async () => {
    try {
      const response = await fetch(`/rejectApplication/${confirmRejectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Include optional rejection message if provided
          message: rejectMessage.trim() || 'Leave application rejected' // Default message if no custom message provided
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject leave application');
      }
      
      // Update the UI with the server response
      const data = await response.json();
      setServerMessage(data.message);
      
      // Send notification to staff member
      sendMessage(confirmRejectId, 'Your leave application has been rejected');
  
      // Reset confirmation modal and rejection message
      setConfirmRejectId(null);
      setRejectMessage('');
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };
  

  const sendMessage = async (applicantId, message) => {
    try {
      const response = await fetch('/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 0, // Set from value as 0
          to: applicantId, // Set to value as applicantId
          message: message
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };
  

  const fetchAdditionalInfo = useCallback(async (applicantId) => {
    const position = getPosition(applicantId);
    const url = `/applicantInfo/${applicantId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${position} info`);
      }
      const data = await response.json();
      setAdditionalInfo((prevInfo) => ({
        ...prevInfo,
        [applicantId]: data
      }));
    } catch (error) {
      console.error(`Error fetching ${position} info:`, error);
    }
  }, [getPosition]);

  useEffect(() => {
    leaveRequests.forEach(request => {
      fetchAdditionalInfo(request.APPLICANT_ID);
    });
  }, [fetchAdditionalInfo, leaveRequests]);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaveRequests.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="lr-container">
      <h3>Leave Requests</h3>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <div>
          <ul>
            {currentItems.map((request) => (
              <li className='LR' key={request.APPLICANT_ID}>
                <p>Staff ID: {request.APPLICANT_ID}</p>
                <p>Position: {getPosition(request.APPLICANT_ID)}</p>
                <p>Reason: {request.REASON_FOR_LEAVE}</p>
                <p>Start Date: {new Date(request.START_DATE).toLocaleDateString()}</p>
                <p>End Date: {new Date(request.END_DATE).toLocaleDateString()}</p>
                <p>Approval: {request.APPROVAL}</p>
                {additionalInfo[request.APPLICANT_ID] && (
                  <div>
                    <p>First Name: {additionalInfo[request.APPLICANT_ID].FIRST_NAME}</p>
                    <p>Last Name: {additionalInfo[request.APPLICANT_ID].LAST_NAME}</p>
                    <p>Email: {additionalInfo[request.APPLICANT_ID].EMAIL}</p>
                    <p>Contact No: {additionalInfo[request.APPLICANT_ID].CONTACT_NO}</p>
                    <p>Department: {additionalInfo[request.APPLICANT_ID].DEPARTMENT}</p>
                  </div>
                )}
                <button onClick={() => handleApprove(request.APPLICANT_ID, getPosition(request.APPLICANT_ID))}>Approve</button>
                {' '}
                <button onClick={() => handleReject(request.APPLICANT_ID)}>Reject</button>
              </li>
            ))}
          </ul>
          {/* Pagination buttons */}
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => paginate(currentPage - 1)}>Previous</button>
            )}
            {currentItems.length === itemsPerPage && (
              <button onClick={() => paginate(currentPage + 1)}>Next</button>
            )}
          </div>
        </div>
      )}
      {confirmApproveId && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <p>Are you sure you want to approve this leave application?</p>
            <button onClick={confirmApproveAction}>Yes</button>
            <button onClick={() => setConfirmApproveId(null)}>No</button>
          </div>
        </div>
      )}
      {confirmRejectId && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <p>Are you sure you want to reject this leave application?</p>
            <input type="text" value={rejectMessage} onChange={(e) => setRejectMessage(e.target.value)} placeholder="Optional message to staff" />
            <button onClick={confirmRejectAction}>Yes</button>
            <button onClick={() => setConfirmRejectId(null)}>No</button>
          </div>
        </div>
      )}
      {serverMessage && (
        <div className="server-message-modal">
          <div className="server-message-content">
            <p>{serverMessage}</p>
            <button onClick={() => setServerMessage('')}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;
