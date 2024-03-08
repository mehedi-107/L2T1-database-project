import React, { useState, useEffect } from 'react';
import BedInfoCard from '../ward/BedInfoCard';
import './WardDuty.css';
import WardInfoTable from './WardInfoTable';
import WardHistory from './WardHistory';    
const WardDuty = ({ doctor }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wardDutyData, setWardDutyData] = useState(null);
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [wardHistory, setWardHistory] = useState([]);

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
                setWardDutyData(data);
                console.log(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ward duty info:', error);
                setLoading(false);
            }
        };
        
        fetchWardDutyInfo();
    }, [doctor]);

    useEffect(() => {
        // Initialize ward and floor options
        setSelectedWard('');
        setSelectedFloor('');
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };

    const handleFloorChange = (e) => {
        setSelectedFloor(e.target.value);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleViewHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/wardHistory?wardNo=${selectedWard} &date=${selectedDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ward history');
            }
            const data = await response.json();
            setWardHistory(data.wardHistory);
            console.log(data.wardHistory);
            
        } catch (error) {
            console.error('Error fetching ward history:', error);
        }
    };

    return (
        <div className="ward-duty-container">
            <h2>Ward Duty Information</h2>
            <div className="ward-duty-options">
                <button className={selectedOption === 'beds' ? 'selected-option' : ''} onClick={() => handleOptionClick('beds')}>View Bed Information</button>
                <button className={selectedOption === 'history' ? 'selected-option' : ''} onClick={() => handleOptionClick('history')}>View Ward History</button>
            </div>
            <div className="ward-duty-info">
                {loading && <div className="loader">Loading...</div>}
                {!loading && selectedOption === 'beds' && (
                    <div className="wards-container">
                        {wardDutyData.map((ward, index) => (
                            <div key={index} className="ward-info">
                                <h3>Ward {ward.WARD_NO} - Floor {ward.FLOOR_NO}</h3>
                                <WardInfoTable ward={ward} doctorId={doctor.userData.user.DOCTOR_ID} />
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
               {!loading && selectedOption === 'history' && (
    <div className="ward-history">
        <h3>Ward History</h3>
        <div className="ward-history-filters">
            <label htmlFor="wardNumber">Enter Ward Number:</label>
            <input 
                type="number" 
                id="wardNumber" 
                value={selectedWard} 
                onChange={handleWardChange} 
                placeholder="Ward Number" 
            />
            <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange} 
                placeholder="Select Date" 
            />
            <button onClick={handleViewHistory}>View History</button>
        </div>
        <ul>
            {wardHistory.map((entry, index) => (
                <WardHistory key={index} entry={entry} />
            ))}

        </ul>
    </div>
)}

                {!loading && !selectedOption && <div>Please select an option to view information.</div>}
            </div>
        </div>
    );
};

export default WardDuty;
