import React from 'react';

const LeaveRequestItem = ({ request, onApprove, onReject }) => {
  const { id, applicantId, reasonForLeave, startDate, endDate, approval } = request;

  const handleApproveClick = () => {
    onApprove(id);
  };

  const handleRejectClick = () => {
    onReject(id);
  };

  return (
    <li>
      <div>
        <span>Applicant ID: {applicantId}</span>
        <span>Reason: {reasonForLeave}</span>
        <span>Start Date: {startDate}</span>
        <span>End Date: {endDate}</span>
        <span>Status: {approval}</span>
        <button onClick={handleApproveClick}>Approve</button>
        <button onClick={handleRejectClick}>Reject</button>
      </div>
    </li>
  );
};

export default LeaveRequestItem;
