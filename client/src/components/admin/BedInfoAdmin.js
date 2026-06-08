import React, { useState, useEffect } from 'react';
import './BedInfoAdmin.css'; // Import CSS file for styling

const BedInfoAdmin = () => {
    const [selectedBed, setSelectedBed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wardHistory, setWardHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Number of items per page
    const [patientInfo, setPatientInfo] = useState(null); // State for patient information

    // Function to fetch ward history based on the selected bed
    const fetchWardHistory = async (patientId) => {
        try {
            const response = await fetch(`/patientsWardHistory/${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ward history');
            }
            const data = await response.json();
            setWardHistory(data.wardHistory.rows);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ward history:', error);
            setLoading(false);
        }
    };

    // Function to fetch patient information based on the selected bed
    const fetchPatientInfo = async (patientId) => {
        try {
            const response = await fetch(`/patientInfoforWard/${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch patient information');
            }
            const data = await response.json();
            setPatientInfo(data);
        } catch (error) {

            console.error('Error fetching patient information:', error);
        }
    };

    useEffect(() => {
        // Parse query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const selectedBedParam = params.get('selectedBed');

        // Set the selected bed state
        setSelectedBed(selectedBedParam);

        // Fetch ward history
        if (selectedBedParam) {
            fetchWardHistory(selectedBedParam);
            fetchPatientInfo(selectedBedParam); // Fetch patient information
        }
    }, [selectedBed]); // Fetch data when selectedBed changes

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = wardHistory.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to format date to display only date without timestamp
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="bed-info-container">
            <h2>Bed Information Admin</h2>
            {loading ? (
                <p>Loading...</p>
            ) : selectedBed ? (
                <>
                    <p>Patient ID: {selectedBed}</p>
                    {patientInfo ? (
    <div>
        {/* Patient Information */}
        <h3>Patient Information</h3>
        <table>
            <tbody>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Patient ID</td>
                    <td>{patientInfo.PATIENT_ID}</td>
                </tr>
                <tr>
                    <td>First Name</td>
                    <td>{patientInfo.PATIENT_FIRST_NAME}</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>{patientInfo.PATIENT_LAST_NAME}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><a href={`mailto:${patientInfo.PATIENT_EMAIL}`}>{patientInfo.PATIENT_EMAIL}</a></td>
                </tr>
                <tr>
                    <td>Contact No</td>
                    <td>{patientInfo.PATIENT_CONTACT_NO}</td>
                </tr>
                {/* Add more patient fields as needed */}
            </tbody>
        </table>

        {/* Ward Information */}
        <h3>Ward Information</h3>
        <table>
            <tbody>
                <tr>
                    <th>WARD_NO</th>
                    <td>{patientInfo.WARD_NO}</td>
                </tr>
                <tr>
                    <th>FLOOR_NO</th>
                    <td>{patientInfo.FLOOR_NO}</td>
                </tr>
                <tr>
                    <th>DOCTOR_ID_DAY</th>
                    <td>{patientInfo.DOCTOR_ID_DAY}</td>
                </tr>
                <tr>
                    <th>DOCTOR_ID_NIGHT</th>
                    <td>{patientInfo.DOCTOR_ID_NIGHT}</td>
                </tr>
                {/* Add more ward fields as needed */}
            </tbody>
        </table>

        {/* Doctor Information */}
        <h3>Doctor Information</h3>
        <table>
            <tbody>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact No</th>
                </tr>
                <tr>
                    <td>{patientInfo.DOCTOR_ID_DAY}</td>
                    <td>{patientInfo.DOCTOR_NAME_DAY}</td>
                    <td><a href={`mailto:${patientInfo.DOCTOR_EMAIL_DAY}`}>{patientInfo.DOCTOR_EMAIL_DAY}</a></td>
                    <td>{patientInfo.DOCTOR_CONTACT_NO_DAY}</td>
                </tr>
                <tr>
                    <td>{patientInfo.DOCTOR_ID_NIGHT}</td>
                    <td>{patientInfo.DOCTOR_NAME_NIGHT}</td>
                    <td><a href={`mailto:${patientInfo.DOCTOR_EMAIL_NIGHT}`}>{patientInfo.DOCTOR_EMAIL_NIGHT}</a></td>
                    <td>{patientInfo.DOCTOR_CONTACT_NO_NIGHT}</td>
                </tr>
            </tbody>
        </table>

        {/* Nurse Information */}
        <h3>Nurse Information</h3>
        <table>
            <tbody>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact No</th>
                </tr>
                <tr>
                    <td>{patientInfo.NURSE_1_ID}</td>
                    <td>{patientInfo.NURSE_1_NAME}</td>
                    <td><a href={`mailto:${patientInfo.NURSE_1_EMAIL}`}>{patientInfo.NURSE_1_EMAIL}</a></td>
                    <td>{patientInfo.NURSE_1_CONTACT_NO}</td>
                </tr>
                <tr>
                    <td>{patientInfo.NURSE_2_ID}</td>
                    <td>{patientInfo.NURSE_2_NAME}</td>
                    <td><a href={`mailto:${patientInfo.NURSE_2_EMAIL}`}>{patientInfo.NURSE_2_EMAIL}</a></td>
                    <td>{patientInfo.NURSE_2_CONTACT_NO}</td>
                </tr>
                <tr>
                    <td>{patientInfo.NURSE_3_ID}</td>
                    <td>{patientInfo.NURSE_3_NAME}</td>
                    <td><a href={`mailto:${patientInfo.NURSE_3_EMAIL}`}>{patientInfo.NURSE_3_EMAIL}</a></td>
                    <td>{patientInfo.NURSE_3_CONTACT_NO}</td>
                </tr>
                <tr>
                    <td>{patientInfo.NURSE_4_ID}</td>
                    <td>{patientInfo.NURSE_4_NAME}</td>
                    <td><a href={`mailto:${patientInfo.NURSE_4_EMAIL}`}>{patientInfo.NURSE_4_EMAIL}</a></td>
                    <td>{patientInfo.NURSE_4_CONTACT_NO}</td>
                </tr>
                {/* Add rows for other nurses as needed */}
            </tbody>
        </table>
    </div>
) : (
    <p>No patient information available.</p>
)}


                    {wardHistory.length > 0 ? (
                        <div className="ward-history-container">
                            <h3>Ward History</h3>
                            <ul>
                                {currentItems.map((entry, index) => (
                                    <li key={index}>
                                        <p>Date: {formatDate(entry.date_column)}</p>
                                        <p>Ward Number: {entry.ward_no}</p>
                                        <p>Floor Number: {entry.floor_no}</p>
                                        <p>Day Doctor: {entry.doctor_name_day}</p>
                                        <p>Night Doctor: {entry.doctor_name_night}</p>
                                        <p>Nurses: {entry.nurse_name_1}, {entry.nurse_name_2}, {entry.nurse_name_3}, {entry.nurse_name_4}</p>
                                        {/* Add more fields as needed */}
                                    </li>
                                ))}
                            </ul>
                            {/* Pagination */}
                            <div className="pagination">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= wardHistory.length}>Next</button>
                            </div>
                            {/* Checkout button */}
                            
                        </div>
                    ) : (
                        <p>No ward history found for this bed.</p>
                    )}
                </>
            ) : (
                <p>No bed selected</p>
            )}
        </div>
    );
};

export default BedInfoAdmin;
