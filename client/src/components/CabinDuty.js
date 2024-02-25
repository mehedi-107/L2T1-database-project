import React, { useState, useEffect } from 'react';
import './CabinDuty.css'; // Import CSS file for styling

const CabinDuty = ({ doctor }) => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [interval, setInterval] = useState(7); // Default interval set to 7 days

    useEffect(() => {
        const fetchDoctorActivities = async () => {
            try {
                const doctorId = doctor.userData.user.DOCTOR_ID;
                const url = `http://localhost:5000/doctorRecentActivitiesInCabin?doctor_id=${doctorId}&interval=${interval+' DAYS'}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch doctor activities');
                }

                const data = await response.json();
                setActivities(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctor activities:', error);
                setLoading(false);
            }
        };

        fetchDoctorActivities();
    }, [doctor, interval]);

    const decrementInterval = () => {
        if (interval > 1) {
            setInterval(interval - 1);
        }
    };

    const incrementInterval = () => {
        setInterval(interval + 1);
    };

    return (
        <div className="cabin-duty-container">
            <h2>Doctor Recent Activities in Cabin</h2>
            <div className="interval-selector">
                <button onClick={decrementInterval}>-</button>
                <input
                    type="number"
                    value={interval}
                    onChange={(e) => setInterval(parseInt(e.target.value))}
                />
                <button onClick={incrementInterval}>+</button>
            </div>
            {loading ? (
                <div className="loader">Loading...</div>
            ) : (
                <div className="activities-list">
                    {activities.length === 0 ? (
                        <p>No activities found for the specified interval.</p>
                    ) : (
                        <ul>
                            {activities.map((activity, index) => (
                                <li key={index} className="activity-item">
                                    <div className="activity-details">
                                        <p>Date: {new Date(activity.DATE).toLocaleDateString()}</p>
                                        <p>Doctor: {activity.DOCTOR_NAME}</p>
                                        <p>Patients: {activity.PATIENT_NAMES.join(', ')}</p>
                                        <p>Nurses: {activity.NURSE_NAMES.join(', ')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default CabinDuty;
