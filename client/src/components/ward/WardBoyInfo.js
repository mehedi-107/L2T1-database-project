import React from 'react';

const WardBoyInfo = () => {
    // Fetch ward boy information for the ward
    // Example: const wardBoys = fetchWardBoys();
    // For now, let's assume we have hardcoded ward boy data
    const wardBoys = [
        { id: 1, name: 'Ward Boy 1', contact: '123-456-7890', duty: 'Morning' },
        { id: 2, name: 'Ward Boy 2', contact: '987-654-3210', duty: 'Night' },
        // Add more ward boy data if needed
    ];

    return (
        <div className="ward-boy-info">
            <h3>Ward Boy Information</h3>
            <ul>
                {wardBoys.map(wardBoy => (
                    <li key={wardBoy.id}>
                        {wardBoy.name} - {wardBoy.contact} - {wardBoy.duty} Duty
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WardBoyInfo;
