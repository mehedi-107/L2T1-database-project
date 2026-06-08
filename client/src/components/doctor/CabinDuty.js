import React, { useState, useEffect } from 'react';
import './CabinDuty.css'; // Import CSS file for styling
import ActivityCard from './ActivityCard'; // Import the ActivityCard component

const CabinDuty = ({ doctor }) => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [cabinDuty, setCabinDuty] = useState([]);
    const [interval, setInterval] = useState(7); // Default interval set to 7 days
    const [currentPage, setCurrentPage] = useState(1);
    const [activitiesPerPage] = useState(6); // Number of activities per page

    useEffect(() => {
        const fetchDoctorActivities = async () => {
            try {
                const doctorId = doctor.userData.user.DOCTOR_ID;
                const activitiesUrl = `/doctorRecentActivitiesInCabin?doctor_id=${doctorId}&interval=${interval + ' DAYS'}`;
                const cabinDutyUrl = `/doctorCabinDuty?doctorId=${doctorId}`;

                const [activitiesResponse, cabinDutyResponse] = await Promise.all([
                    fetch(activitiesUrl),
                    fetch(cabinDutyUrl)
                ]);

                if (!activitiesResponse.ok || !cabinDutyResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const activitiesData = await activitiesResponse.json();
                const cabinDutyData = await cabinDutyResponse.json();

                setActivities(activitiesData);
                setCabinDuty(cabinDutyData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
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
    const handleCheckout = async (cabinId) => {
        try {
            const response = await fetch(`/checkout/${cabinId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cabinId: cabinId
                })
            });
            if (!response.ok) {
                throw new Error('Failed to checkout');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity).filter(activity => activity.PATIENT_NAMES && activity.PATIENT_NAMES.length > 0);

    const nextPage = () => {
        if (indexOfLastActivity < activities.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="cabin-duty-container">
            <h2>Cabin Duty</h2>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : (
                <div>
                    {cabinDuty.map((cabin, index) => (
                        <div key={index} className="cabin-info">
                            <h3>Cabin No: {cabin.CABIN_NO}</h3>
                            
                            {/* Display cabin information */}
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Patient Name:</td>
                                        <td>{cabin.PATIENT_FIRST_NAME} {cabin.PATIENT_LAST_NAME}</td>
                                    </tr>
                                    <tr>
                                        <td>Patient Gender:</td>
                                        <td>{cabin.PATIENT_GENDER}</td>
                                    </tr>
                                    <tr>
                                        <td>Patient Email:</td>
                                        <td>{cabin.PATIENT_EMAIL_ID}</td>
                                    </tr>
                                    <tr>
                                        <td>Patient Contact No:</td>
                                        <td>{cabin.PATIENT_CONTACT_NO}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4>Companion Doctor</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Name:</td>
                                        <td>{cabin.NIGHT_DOCTOR_FIRST_NAME} {cabin.NIGHT_DOCTOR_LAST_NAME}</td>
                                    </tr>
                                    <tr>
                                        <td>Email:</td>
                                        <td>{cabin.NIGHT_DOCTOR_EMAIL}</td>
                                    </tr>
                                    <tr>
                                        <td>Contact No:</td>
                                        <td>{cabin.NIGHT_DOCTOR_CONTACT_NO}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4>Nurse Information</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Nurse 1:</td>
                                        <td>{cabin.NURSE_1_FIRST_NAME} {cabin.NURSE_1_LAST_NAME} ({cabin.NURSE_1_SHIFT})</td>
                                        <td>Email:</td>
                                        <td>{cabin.NURSE_1_EMAIL_ID}</td>
                                        <td>Contact No:</td>
                                        <td>{cabin.NURSE_1_CONTACT_NO}</td>
                                    </tr>
                                    <tr>
                                        <td>Nurse 2:</td>
                                        <td>{cabin.NURSE_2_FIRST_NAME} {cabin.NURSE_2_LAST_NAME} ({cabin.NURSE_2_SHIFT})</td>
                                        <td>Email:</td>
                                        <td>{cabin.NURSE_2_EMAIL_ID}</td>
                                        <td>Contact No:</td>
                                        <td>{cabin.NURSE_2_CONTACT_NO}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="checkout-button" onClick={() => handleCheckout(cabin.CABIN_NO+cabin.FLOOR_NO*100)}>Checkout</button>

                        </div>
                    ))}
                </div>

            )}
   
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
                    {currentActivities.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} />
                    ))}
                </div>
            )}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={nextPage} disabled={indexOfLastActivity >= activities.length}>Next</button>
            </div>

            {/* Checkout button */}
            
        </div>
    );
};

export default CabinDuty;
