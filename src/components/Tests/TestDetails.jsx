import React, { useState, useEffect } from 'react';
import { getTestResults } from '../../services/api';

const TestDetails = ({ testId }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await getTestResults(testId);
                setResults(response);
            } catch (error) {
                console.error('Failed to fetch test results:', error);
            }
        };

        fetchResults();
    }, [testId]);

    return (
        <div>
            <h3>Test Details</h3>
            <ul>
                {results.map((result, index) => (
                    <li key={index} style={{ color: result.user_answer.is_correct ? 'green' : 'red' }}>
                        {result.user_answer.word_original} - {result.user_answer.is_correct ? 'Correct' : 'Incorrect'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestDetails;