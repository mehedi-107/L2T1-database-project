import React, { useState } from 'react';
import './LeaveApplication.css';

const LeaveApplication = ({ staffId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/leaveApplication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staffId,
                    startDate,
                    endDate,
                    reason
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit leave application');
            }

            // Reset form fields after successful submission
            setStartDate('');
            setEndDate('');
            setReason('');
            setLoading(false);
        } catch (error) {
            console.error('Error submitting leave application:', error);
            setError('An error occurred while submitting the leave application. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="leave-application-container">
            <h2>Leave Application</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Staff ID:</label>
                    <span>{staffId}</span>
                </div>
                <div className="form-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Reason:</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={loading}>Submit Application</button>
            </form>
        </div>
    );
};

export default LeaveApplication;
