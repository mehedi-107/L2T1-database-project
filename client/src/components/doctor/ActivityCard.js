import React from 'react';
import './ActivityCard.css'; // Import CSS file for styling

const ActivityCard = ({ activity }) => {
    const formatActivityDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day} ${year}`;
    };

    return (
        <div className="activity-card">
            <div className="card-header">
                <h3>Cabin No: {activity.CABIN_ID}</h3>
                <p>Activity Date: {formatActivityDate(activity.DATE)}</p>
            </div>
            <div className="card-body">
                <p><strong>Patient Name:</strong> {activity.PATIENT_NAMES.join(', ')}</p>
                <p><strong>Nurses:</strong> {activity.NURSE_NAMES.join(', ')}</p>
            </div>
        </div>
    );
};

export default ActivityCard;
