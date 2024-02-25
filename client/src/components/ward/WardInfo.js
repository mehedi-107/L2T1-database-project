import React from 'react';
import NurseInfo from './NurseInfo';
import WardBoyInfo from './WardBoyInfo';

const WardInfo = () => {
    return (
        <div className="ward-info-container">
            <h2>Ward Information</h2>
            <div className="ward-info">
                <h3>Number of Beds: 10</h3>
                <NurseInfo />
                <WardBoyInfo />
            </div>
        </div>
    );
};

export default WardInfo;
