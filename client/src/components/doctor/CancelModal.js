import React, { useState } from 'react';

const CancelModal = ({ cabinId, onCancel }) => {
    const [reason, setReason] = useState('');

    const handleCancel = () => {
        // Call the onCancel function with the reason and cabinId
        onCancel(cabinId, reason);
        // Clear the reason input after submission
        setReason('');
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => onCancel(null, '')}>&times;</span>
                <h2>Cancel Cabin Duty</h2>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for cancellation..."
                />
                <button onClick={handleCancel}>Submit</button>
            </div>
        </div>
    );
};

export default CancelModal;
