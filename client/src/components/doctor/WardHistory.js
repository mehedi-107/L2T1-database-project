import React from 'react';
import './WardHistory.css';
import BedHistorCard from './BedHistoryCard';

const WardHistory = ({ entry }) => {
    console.log(entry);

    return (
        <div className="ward-history">
            <div className="ward-history-entry">
                <h4>Ward {entry.WARD_NO}</h4>
                <p>Date: {new Date(entry.DATE).toLocaleDateString()}</p>
                <div className="ward-info-table">
                    <h5>Ward Information</h5>
                    <table>
                        <tbody>
                            <tr>
                                <td>Ward Number:</td>
                                <td>{entry.WARD_NO}</td>
                            </tr>
                            <tr>
                                <td>Floor Number:</td>
                                <td>{entry.FLOOR_NO}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="doctor-info-table">
                    <h5>Doctor Information</h5>
                    <table>
                        <tbody>
                            <tr>
                                <td>Doctor (Day):</td>
                                <td>{entry.DOCTOR_DAY_NAME}</td>
                                <td>Email:</td>
                                <td>{entry.DOCTOR_DAY_EMAIL}</td>
                                <td>Contact:</td>
                                <td>{entry.DOCTOR_DAY_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Doctor (Night):</td>
                                <td>{entry.DOCTOR_NIGHT_NAME}</td>
                                <td>Email:</td>
                                <td>{entry.DOCTOR_NIGHT_EMAIL}</td>
                                <td>Contact:</td>
                                <td>{entry.DOCTOR_NIGHT_CONTACT}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="nurse-info-table">
                    <h5>Nurse Information</h5>
                    <table>
                        <tbody>
                            <tr>
                                <td>Nurse 1:</td>
                                <td>{entry.NURSE_1_NAME}</td>
                                <td>Email:</td>
                                <td>{entry.NURSE_1_EMAIL}</td>
                                <td>Contact:</td>
                                <td>{entry.NURSE_1_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Nurse 2:</td>
                                <td>{entry.NURSE_2_NAME}</td>
                                <td>Email:</td>
                                <td>{entry.NURSE_2_EMAIL}</td>
                                <td>Contact:</td>
                                <td>{entry.NURSE_2_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Nurse 3:</td>
                                <td>{entry.NURSE_3_NAME}</td>
                                <td>Email:</td>
                                <td>{entry.NURSE_3_EMAIL}</td>
                                <td>Contact:</td>
                                <td>{entry.NURSE_3_CONTACT}</td>
                            </tr>
                            <tr>
                                <td>Nurse 4:</td>
                                <td>{entry.NURSE_4_NAME}</td>
                                <td>Email:</td>
                                <td>{entry.NURSE_4_EMAIL}</td>
                                <td>Contact:</td>
                                <td>{entry.NURSE_4_CONTACT}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="beds-container1">
    <div className="left-beds">
        {Object.entries(entry)
            .filter(([key]) => key.startsWith('BED_'))
            .slice(0, 5) // Take the first 5 beds
            .map(([key, value]) => {
                const bedNumber = key.replace('BED_', '');
                return <BedHistorCard key={key} bedNumber={bedNumber} bedValue={value} />;
            })}
    </div>
    <div className="right-beds">
        {Object.entries(entry)
            .filter(([key]) => key.startsWith('BED_'))
            .slice(5, 10) // Take the next 5 beds
            .map(([key, value]) => {
                const bedNumber = key.replace('BED_', '');
                return <BedHistorCard key={key} bedNumber={bedNumber} bedValue={value} />;
            })}
    </div>
</div>

        </div>
    );
};

export default WardHistory;
