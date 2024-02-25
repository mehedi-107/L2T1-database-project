import React, { useState, useEffect } from 'react';
import './BedInfo.css'; // Import CSS file for styling

const BedInfo = () => {
    const [selectedBed, setSelectedBed] = useState(null);
    const [patientInfo, setPatientInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [wardHistory, setWardHistory] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [nurseInfo, setNurseInfo] = useState({});
    const [wardBoyInfo, setWardBoyInfo] = useState({});

    useEffect(() => {
        // Parse query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const selectedBedParam = params.get('selectedBed');

        // Set the selected bed state
        setSelectedBed(selectedBedParam);

        const fetchPatientInfo = async () => {
            try {
                // Make a server request to fetch patient info based on selected bed
                const response = await fetch(`http://localhost:5000/patientHistory?patientId=${selectedBedParam}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch patient information');
                }
                const data = await response.json();
                // Assuming the response contains patient information
                console.log(data);
                if (data && data.length > 0) {
                    // Sort patientInfo array based on the DATE in descending order
                    data.sort((a, b) => new Date(b.DATE) - new Date(a.DATE));
                    setPatientInfo(data);
                    fetchWardHistory(data[0]); // Fetch ward history for the latest entry
                } else {
                    setPatientInfo([]);
                }
            } catch (error) {
                console.error('Error fetching patient information:', error);
                setPatientInfo([]);
            } finally {
                setLoading(false);
            }
        };

        if (selectedBedParam) {
            fetchPatientInfo();
        } else {
            setLoading(false);
        }
    }, [selectedBed]);

    const fetchWardHistory = async (latestEntry) => {
        try {
            // Make a server request to fetch previous ward history of the patient
            const response = await fetch(`http://localhost:5000/previousWardHistory?patientId=${latestEntry.BED_ID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ward history');
            }
            const data = await response.json();
            // Assuming the response contains the patient's previous ward history
            console.log(data);
            setWardHistory(data);
            // Fetch nurse info
            fetchNurseInfo(latestEntry.NURSE_ID_1);
            // Fetch ward boy info
            fetchWardBoyInfo(latestEntry.WARD_BOY_ID_1);
        } catch (error) {
            console.error('Error fetching ward history:', error);
            setWardHistory([]);
        }
    };

    const fetchNurseInfo = async (nurseId) => {
        try {
            const response = await fetch(`http://localhost:5000/nurseInfo?nurseId=${nurseId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch nurse information');
            }
            const data = await response.json();
            console.log(data);
            setNurseInfo(data);
        } catch (error) {
            console.error('Error fetching nurse information:', error);
            setNurseInfo({});
        }
    };

    const fetchWardBoyInfo = async (wardBoyId) => {
        try {
            const response = await fetch(`http://localhost:5000/wardBoyInfo?wardBoyId=${wardBoyId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ward boy information');
            }
            const data = await response.json();
            console.log(data);
            setWardBoyInfo(data);
        } catch (error) {
            console.error('Error fetching ward boy information:', error);
            setWardBoyInfo({});
        }
    };

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = patientInfo.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle selection of staff
    const handleStaffSelect = (staffId) => {
        setSelectedStaff(staffId);
    };

    return (
        <div className="bed-info-container">
            <h2>Bed Information</h2>
            {loading ? (
                <p>Loading...</p>
            ) : selectedBed ? (
                <>
                    <p>Selected Bed: {selectedBed}</p>
                    {currentItems.length > 0 ? (
                        <>
                            {currentItems.map((info, index) => (
                                <div key={index} className="patient-info">
                                    <p>Date: {info.DATE}</p>
                                    <p>Ward Number: {info.WARD_NO}</p>
                                    <p>Floor Number: {info.FLOOR_NO}</p>
                                    
                                    {/* Add more fields as needed */}
                                   
                                </div>
                            ))}
                            {/* Pagination */}
                            <div className="pagination">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= patientInfo.length}>Next</button>
                            </div>
                            {/* Display ward history */}
                            <div className="ward-history-container">
                                <h3>Ward History</h3>
                                {/* Staff selection */}
                                <select onChange={(e) => handleStaffSelect(e.target.value)}>
                                    <option value="">All Staff</option>
                                    {/* Render options for staff */}
                                </select>
                                {/* Display nurse info */}
                                <div className="nurse-info">
                                    <h4>Nurse Information</h4>
                                    <p>ID: {nurseInfo.ID}</p>
                                    <p>Name: {nurseInfo.Name}</p>
                                    {/* Add more nurse info fields */}
                                </div>
                                {/* Display ward boy info */}
                                <div className="ward-boy-info">
                                    <h4>Ward Boy Information</h4>
                                    <p>ID: {wardBoyInfo.ID}</p>
                                    <p>Name: {wardBoyInfo.Name}</p>
                                    {/* Add more ward boy info fields */}
                                </div>
                                {/* Display ward history entries */}
                                <ul>
                                    {wardHistory.map((entry, index) => (
                                        <li key={index}>
                                            {/* Display ward history entry details */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p>No patient information found for this bed.</p>
                    )}
                </>
            ) : (
                <p>No bed selected</p>
            )}
        </div>
    );
};

export default BedInfo;
