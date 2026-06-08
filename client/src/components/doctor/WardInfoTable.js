import React, { useState } from 'react';

const WardInfoTable = ({ ward,doctorId }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="ward-info-table">
          
            <table>
                <tbody>
                {doctorId !== ward.DOCTOR_ID_DAY && ( 
            <>
                <tr>
                    <td>Companion Doctor (Day): </td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{ward.DOCTOR_DAY_NAME}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>{ward.DOCTOR_DAY_EMAIL}</td>
                </tr>
                <tr>
                    <td>Contact:</td>
                    <td>{ward.DOCTOR_DAY_CONTACT}</td>
                </tr>
                <tr>
                    <td>Specialization:</td>
                    <td>{ward.DOCTOR_DAY_SPECIALIZATION}</td>
                </tr>
            </>
        )}
        
        {doctorId !== ward.DOCTOR_ID_NIGHT && (
            <>
                <tr>
                    <td>Companion Doctor (Night): </td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{ward.DOCTOR_NIGHT_NAME}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>{ward.DOCTOR_NIGHT_EMAIL}</td>
                </tr>
                <tr>
                    <td>Contact:</td>
                    <td>{ward.DOCTOR_NIGHT_CONTACT}</td>
                </tr>
                <tr>
                    <td>Specialization:</td>
                    <td>{ward.DOCTOR_NIGHT_SPECIALIZATION}</td>
                </tr>
            </>
        )}
                    
                    {expanded && (
                        <>
                            <tr>
                                <td>Nurse 1:</td>
                                <td>{ward.NURSE_1_NAME} - {ward.NURSE_1_EMAIL} - {ward.NURSE_1_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Nurse 2:</td>
                                <td>{ward.NURSE_2_NAME} - {ward.NURSE_2_EMAIL} - {ward.NURSE_2_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Nurse 3:</td>
                                <td>{ward.NURSE_3_NAME} - {ward.NURSE_3_EMAIL} - {ward.NURSE_3_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Nurse 4:</td>
                                <td>{ward.NURSE_4_NAME} - {ward.NURSE_4_EMAIL} - {ward.NURSE_4_CONTACT}</td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
            <button onClick={toggleExpansion}>{expanded ? 'See Less' : 'See More'}</button>
        </div>
    );
};

export default WardInfoTable;
