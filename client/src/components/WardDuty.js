// WardDuty.js
import React, { useState, useEffect } from 'react';
import BedInfoCard from './ward/BedInfoCard';
import './WardDuty.css';

const WardDuty = ({ doctor }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wardDutyData, setWardDutyData] = useState(null);

    useEffect(() => {
        const fetchWardDutyInfo = async () => {
            try {
                const x = doctor.userData.user.DOCTOR_ID;
                const url = `http://localhost:5000/doctorWardDuty?doctorId=${x}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch ward duty info');
                }
                
                const data = await response.json();
                console.log(data);
                setWardDutyData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ward duty info:', error);
                setLoading(false);
            }
        };
        
        fetchWardDutyInfo();
    }, [doctor]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="ward-duty-container">
            <h2>Ward Duty Information</h2>
            <div className="ward-duty-options">
                <button className={selectedOption === 'beds' ? 'selected-option' : ''} onClick={() => handleOptionClick('beds')}>View Bed Information</button>
            </div>
            <div className="ward-duty-info">
                {loading && <div className="loader">Loading...</div>}
                {!loading && selectedOption === 'beds' && (
                    <div className="wards-container">
                        {wardDutyData.map((ward, index) => (
                            <div key={index} className="ward-info">
                                <h3>Ward {ward.WARD_NO} - Floor {ward.FLOOR_NO}</h3>
                                <div className="beds-container">
                                    <div className="left-beds">
                                        {Object.entries(ward)
                                            .filter(([bedKey]) => bedKey.startsWith('BED_'))
                                            .slice(0, 5)
                                            .map(([bedKey, bedValue]) => {
                                                const bedNumber = bedKey.replace('BED_', '');
                                                return <BedInfoCard key={bedKey} bedNumber={bedNumber} bedValue={bedValue} />;
                                            })}
                                    </div>
                                    <div className="right-beds">
                                        {Object.entries(ward)
                                            .filter(([bedKey]) => bedKey.startsWith('BED_'))
                                            .slice(5, 10)
                                            .map(([bedKey, bedValue]) => {
                                                const bedNumber = bedKey.replace('BED_', '');
                                                return <BedInfoCard key={bedKey} bedNumber={bedNumber} bedValue={bedValue} />;
                                            })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && !selectedOption && <div>Please select an option to view information.</div>}
            </div>
        </div>
    );
};

export default WardDuty;
