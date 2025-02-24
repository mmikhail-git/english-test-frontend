import React, { useState } from 'react';
import TestDetails from './TestDetails'; // Импортируем компонент TestDetails

const TestHistory = ({ tests, onTestSelect }) => {
    const [selectedTestId, setSelectedTestId] = useState(null);

    if (!tests || tests.length === 0) {
        return <p>No tests found.</p>;
    }

    return (
        <div>
            <h2>Test History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map((test) => (
                        <React.Fragment key={test.id}>
                            <tr onClick={() => setSelectedTestId(test.id === selectedTestId ? null : test.id)}>
                                <td>{new Date(test.created_at).toLocaleDateString()}</td>
                                <td>{test.accuracy ?? 'N/A'}%</td>
                            </tr>
                            {test.id === selectedTestId && (
                                <tr>
                                    <td colSpan="2">
                                        <TestDetails testId={test.id} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestHistory;