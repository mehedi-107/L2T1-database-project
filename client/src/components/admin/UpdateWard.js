import React, { useState, useEffect } from 'react';
import BedInfoCard from '../ward/BedInfoCard'; // Adjust the path based on the directory structure
import './UpdateWard.css'; // Adjust the path based on the directory structure

const UpdateWard = () => {
    const [wardId, setWardId] = useState('');
    const [wardDetails, setWardDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedWardDetails, setUpdatedWardDetails] = useState({
        DOCTOR_ID_DAY: '',
        DOCTOR_ID_NIGHT: '',
        NURSE_ID_1: '',
        NURSE_ID_2: '',
        NURSE_ID_3: '',
        NURSE_ID_4: ''
    });
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [availableNurses, setAvailableNurses] = useState([]);

    useEffect(() => {
        const fetchAvailableDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5000/availableDoctorsWard');
                const data = await response.json();
                setAvailableDoctors(data);
            } catch (error) {
                console.error('Error fetching available doctors:', error);
            }
        };

        const fetchAvailableNurses = async () => {
            try {
                const response = await fetch('http://localhost:5000/availableNurses');
                const data = await response.json();
                setAvailableNurses(data);
            } catch (error) {
                console.error('Error fetching available nurses:', error);
            }
        };

        fetchAvailableDoctors();
        fetchAvailableNurses();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/wardInfo/${wardId}`);
            const data = await response.json();
            setWardDetails(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching ward details:', error);
        }
    };

    const handleDoctorChange = (field) => (e) => {
        setUpdatedWardDetails({ ...updatedWardDetails, [field]: e.target.value });
    };

    const handleNurseChange = (field) => (e) => {
        setUpdatedWardDetails({ ...updatedWardDetails, [field]: e.target.value });
    };

    const handleSave = async () => {
        setEditMode(false);
        // Check for duplicate nurse assignments
        const nurseIds = Object.values(updatedWardDetails).filter(value => value.startsWith('N'));
        const uniqueNurseIds = new Set(nurseIds);
        if (nurseIds.length !== uniqueNurseIds.size) {
            console.error('Error: Duplicate nurse assignments detected.');
            return;
        }
        // Check for duplicate doctor assignments
        const doctorIds = Object.values(updatedWardDetails).filter(value => value.startsWith('D'));
        const uniqueDoctorIds = new Set(doctorIds);
        if (doctorIds.length !== uniqueDoctorIds.size) {
            console.error('Error: Duplicate doctor assignments detected.');
            return;
        }
        try {
            // Create a copy of updatedWardDetails with unchanged doctor IDs
            const updatedDetailsWithUnchangedDoctors = {
                ...updatedWardDetails,
                DOCTOR_ID_DAY: updatedWardDetails.DOCTOR_ID_DAY || wardDetails.DOCTOR_ID_DAY,
                DOCTOR_ID_NIGHT: updatedWardDetails.DOCTOR_ID_NIGHT || wardDetails.DOCTOR_ID_NIGHT,
                // Include nurse IDs 1 and 2 conditionally
                NURSE_ID_1: updatedWardDetails.NURSE_ID_1 || wardDetails.NURSE_ID_1,
                NURSE_ID_2: updatedWardDetails.NURSE_ID_2 || wardDetails.NURSE_ID_2,
                // Include nurse IDs 3 and 4 conditionally
                NURSE_ID_3: updatedWardDetails.NURSE_ID_3 || wardDetails.NURSE_ID_3,
                NURSE_ID_4: updatedWardDetails.NURSE_ID_4 || wardDetails.NURSE_ID_4
            };
            const response = await fetch(`http://localhost:5000/updateWardDetails/${wardDetails.WARD_NO + wardDetails.FLOOR_NO * 100}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetailsWithUnchangedDoctors),
            });
            if (!response.ok) {
                console.error('Error updating ward details:', response.statusText);
                return;
            }
            // Retrieve updated ward details
            const updatedWardResponse = await fetch(`http://localhost:5000/wardInfo/${wardDetails.WARD_NO}`);
            const updatedWardData = await updatedWardResponse.json();
            setWardDetails(updatedWardData);
            console.log('Ward details updated successfully');
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    return (
        <div className="ward-card">
            <h3>Update Ward Details</h3>
            <input
                type="text"
                placeholder="Ward ID (101-120, 201-220, ...)"
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {wardDetails && (
                <>
                    <table className="ward-table">
                        <thead>
                            <tr>
                                <th>Ward Details</th>
                                <th>Doctor Information</th>
                                <th>Nurse Information</th>
                                <th>Contact Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Ward ID: {wardDetails.WARD_NO}</p>
                                    <p>Floor No: {wardDetails.FLOOR_NO}</p>
                                </td>
                                <td>
                                    <p>
                                        Doctor ID (Day): {editMode ? (
                                            <select
                                                value={updatedWardDetails.DOCTOR_ID_DAY}
                                                onChange={handleDoctorChange('DOCTOR_ID_DAY')}
                                            >
                                                <option value="">Select Doctor</option>
                                                {availableDoctors.map((doctor) => (
                                                    <option key={doctor.DOCTOR_ID} value={doctor.DOCTOR_ID}>
                                                        {doctor.DOCTOR_NAME} - {doctor.DOCTOR_ID}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span>{wardDetails.DOCTOR_ID_DAY}</span>
                                        )}
                                    </p>
                                    <p>
                                        Doctor ID (Night): {editMode ? (
                                            <select
                                                value={updatedWardDetails.DOCTOR_ID_NIGHT}
                                                onChange={handleDoctorChange('DOCTOR_ID_NIGHT')}
                                            >
                                                <option value="">Select Doctor</option>
                                                {availableDoctors.map((doctor) => (
                                                    <option key={doctor.DOCTOR_ID} value={doctor.DOCTOR_ID}>
                                                        {doctor.DOCTOR_NAME} - {doctor.DOCTOR_ID}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span>{wardDetails.DOCTOR_ID_NIGHT}</span>
                                        )}
                                    </p>
                                </td>
                                <td>
                                    {[1, 2, 3, 4].map((nurseIndex) => (
                                        <p key={nurseIndex}>
                                            Nurse ID {nurseIndex}:{' '}
                                            {editMode ? (
                                                <select
                                                    value={updatedWardDetails[`NURSE_ID_${nurseIndex}`]}
                                                    onChange={handleNurseChange(`NURSE_ID_${nurseIndex}`)}
                                                >
                                                    <option value="">Select Nurse</option>
                                                    {availableNurses.map((nurse) => (
                                                        <option key={nurse.NURSE_ID} value={nurse.NURSE_ID}>
                                                            {nurse.NURSE_NAME}-{nurse.NURSE_ID}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>{wardDetails[`NURSE_ID_${nurseIndex}`]}</span>
                                            )}
                                        </p>
                                    ))}
                                </td>
                                <td>
                                    <p>Doctor Email (Day): {wardDetails.DOCTOR_EMAIL_DAY}</p>
                                    <p>Doctor Contact No (Day): {wardDetails.DOCTOR_CONTACT_NO_DAY}</p>
                                    <p>Doctor Email (Night): {wardDetails.DOCTOR_EMAIL_NIGHT}</p>
                                    <p>Doctor Contact No (Night): {wardDetails.DOCTOR_CONTACT_NO_NIGHT}</p>
                                    <p>Nurse 1 Name: {wardDetails.NURSE_1_NAME}</p>
                                    <p>Nurse 1 Email: {wardDetails.NURSE_1_EMAIL}</p>
                                    <p>Nurse 1 Contact No: {wardDetails.NURSE_1_CONTACT_NO}</p>
                                    <p>Nurse 2 Name: {wardDetails.NURSE_2_NAME}</p>
                                    <p>Nurse 2 Email: {wardDetails.NURSE_2_EMAIL}</p>
                                    <p>Nurse 2 Contact No: {wardDetails.NURSE_2_CONTACT_NO}</p>
                                    <p>Nurse 3 Name: {wardDetails.NURSE_3_NAME}</p>
                                    <p>Nurse 3 Email: {wardDetails.NURSE_3_EMAIL}</p>
                                    <p>Nurse 3 Contact No: {wardDetails.NURSE_3_CONTACT_NO}</p>
                                    <p>Nurse 4 Name: {wardDetails.NURSE_4_NAME}</p>
                                    <p>Nurse 4 Email: {wardDetails.NURSE_4_EMAIL}</p>
                                    <p>Nurse 4 Contact No: {wardDetails.NURSE_4_CONTACT_NO}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="bed-info">
                        <h4>Bed Information</h4>
                        <div className="beds-container1">
                            <div className="left-beds1">
                                {Object.entries(wardDetails)
                                    .filter(([bedKey]) => bedKey.startsWith('BED_'))
                                    .slice(0, 5)
                                    .map(([bedKey, bedValue]) => {
                                        const bedNumber = bedKey.replace('BED_', '');
                                        return <BedInfoCard key={bedKey} bedNumber={bedNumber} bedValue={bedValue} viewedBy={"admin"} />;
                                    })}
                            </div>
                            <div className="right-beds">
                                {Object.entries(wardDetails)
                                    .filter(([bedKey]) => bedKey.startsWith('BED_'))
                                    .slice(5, 10)
                                    .map(([bedKey, bedValue]) => {
                                        const bedNumber = bedKey.replace('BED_', '');
                                        return <BedInfoCard key={bedKey} bedNumber={bedNumber} bedValue={bedValue} viewedBy={"admin"} />;
                                    })}
                            </div>
                        </div>
                    </div>
                    {editMode ? (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setEditMode(true)}>Edit</button>
                    )}
                </>
            )}
        </div>
    );
};

export default UpdateWard;
