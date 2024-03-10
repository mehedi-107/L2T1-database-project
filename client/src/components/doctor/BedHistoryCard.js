import React from 'react';
import './BedHistoryCard.css';
const BedHistorCard = ({ bedNumber, bedValue, viewedBy }) => { 
    console.log(bedNumber, bedValue);
    console.log(viewedBy);  
    


    return (
        <div className="bed-info-card">
            <h3>
                {bedNumber}: {bedValue !== null ? bedValue : "No patient"}  
              
            </h3>
        </div> 
    );
};

export default BedHistorCard;
