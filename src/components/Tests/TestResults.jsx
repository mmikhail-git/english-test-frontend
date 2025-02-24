import React from 'react';

const TestResults = ({ results }) => {
    return (
        <div>
            <h2>Test Results</h2>
            {results && (
                <p>Accuracy: {results.accuracy}%</p>
            )}
        </div>
    );
};

export default TestResults;