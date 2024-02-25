import React from 'react';
import './BedInfoCard.css';
import BedInfo from './BedInfo';

const BedInfoCard = ({ bedNumber, bedValue }) => { 
    console.log(bedNumber, bedValue);
    const openBedInfo = () => {
        // Construct the URL with the selected bed information as a query parameter
        const url = `/bedInfo?selectedBed=${bedValue}`;
        
        // Open the URL in a new window
        window.open(url, '_blank');
    };
    
   
    return (
        <div className="bed-info-card">
            <h3>{bedNumber}: {bedValue !== null ? bedValue : "No patient"}</h3>
            <button onClick={openBedInfo}>Show Details</button>
        </div>
    );
};

export default BedInfoCard;
