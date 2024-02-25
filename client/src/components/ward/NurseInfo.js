import React from 'react';

const NurseInfo = () => {
    // Fetch nurse information for the ward
    // Example: const nurses = fetchNurses();
    // For now, let's assume we have hardcoded nurse data
    const nurses = [
        { id: 1, name: 'Nurse 1', contact: '123-456-7890', shift: 'Morning' },
        { id: 2, name: 'Nurse 2', contact: '987-654-3210', shift: 'Night' },
        // Add more nurse data if needed
    ];

    return (
        <div className="nurse-info">
            <h3>Nurse Information</h3>
            <ul>
                {nurses.map(nurse => (
                    <li key={nurse.id}>
                        {nurse.name} - {nurse.contact} - {nurse.shift} Shift
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NurseInfo;
