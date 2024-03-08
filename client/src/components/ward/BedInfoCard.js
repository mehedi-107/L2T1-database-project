import React from 'react';
import './BedInfoCard.css';
import BedInfo from './BedInfo';

const BedInfoCard = ({ bedNumber, bedValue, viewedBy }) => { 
    console.log(bedNumber, bedValue);
    console.log(viewedBy);  
    const openBedInfo = () => {
        // Construct the URL based on the value of viewedBy
        let url;
        if (viewedBy === 'doctor') {
            url = `/bedInfo?selectedBed=${bedValue}`;
        } else if (viewedBy == 'admin') {
            url = `/bedInfoAdmin?selectedBed=${bedValue}`;
        } else {
            // Handle other cases or default behavior
            url = `/bedInfo?selectedBed=${bedValue}`;
        }
        
        // Open the URL in a new window
        window.open(url, '_blank');
    };
    
   
    return (
        <div className="bed-info-card">
            <h3>
                {bedNumber}: {bedValue !== null ? bedValue : "No patient"}  
                {bedValue !== null ? (
                    <button onClick={openBedInfo}>View</button>
                ) : null}
            </h3>
        </div> 
    );
};

export default BedInfoCard;
