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
            <h4>Update Ward Details</h4>
            <input
                type="text"
                placeholder="Ward ID (101-120, 201-220, ...)"
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {wardDetails && (
                <>
                    <h3>Ward Details</h3>
    <table className="ward-table">
        <thead>
            <tr>
                <th>Ward ID</th>
                <th>Floor No</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{wardDetails.WARD_NO}</td>
                <td>{wardDetails.FLOOR_NO}</td>
            </tr>
        </tbody>
    </table>

    <h3>Doctor Details</h3>
    <table className="doctor-table">
        <thead>
            <tr>
                <th>Shift</th>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Day</td>
                <td>
                    {editMode ? (
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
                        wardDetails.DOCTOR_ID_DAY
                    )}
                </td>
                <td>{wardDetails.DCOTOR_DAY_FIRST_NAME} {wardDetails.DOCTOR_DAY_LAST_NAME}</td>
            </tr>
            <tr>
                <td>Night</td>
                <td>
                    {editMode ? (
                        <select
                            value={updatedWardDetails.DOCTOR_ID_NIGHT}
                            onChange={handleDoctorChange('DOCTOR_ID_NIGHT')}
                        >
                            <option value="">Select Doctor</option>
                            {availableDoctors.map((doctor) => (
                                <option key={doctor.DOCTOR_ID} value={doctor.DOCTOR_ID}>
                                   {doctor.DOCTOR_NAME}-{doctor.DOCTOR_ID}
                                </option>
                            ))}
                        </select>
                    ) : (
                        wardDetails.DOCTOR_ID_NIGHT
                    )}
                </td>
                <td>{wardDetails.DOCTOR_NIGHT_FIRST_NAME} {wardDetails.DOCTOR_NIGHT_LAST_NAME}</td>
            </tr>
        </tbody>
    </table>

    <h3>Nurse Details</h3>
    <table className="nurse-table">
        <thead>
            <tr>
                <th>Nurse ID</th>
                <th>Nurse Name</th>
            </tr>
        </thead>
        <tbody>
            {[1, 2, 3, 4].map((nurseIndex) => (
                <tr key={nurseIndex}>
                    <td>
                        {editMode ? (
                            <select
                                value={updatedWardDetails[`NURSE_ID_${nurseIndex}`]}
                                onChange={handleNurseChange(`NURSE_ID_${nurseIndex}`)}
                            >
                                <option value="">Select Nurse</option>
                                {availableNurses.map((nurse) => (
                                    <option key={nurse.NURSE_ID} value={nurse.NURSE_ID}>
                                    {nurse.NURSE_NAME}-    {nurse.NURSE_ID}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            wardDetails[`NURSE_ID_${nurseIndex}`]
                        )}
                    </td>
                    <td>{wardDetails[`NURSE_${nurseIndex}_FULL_NAME`]}</td>
                </tr>
            ))}
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
