import React, { useState, useEffect, useCallback } from 'react';
import { startTest, submitTestAnswers } from '../services/api';
import TestStart from '../components/Tests/TestStart';
import TestQuestion from '../components/Tests/TestQuestion';
import { useLocation } from 'react-router-dom';
import { decodeJWT } from '../utils/jwt';
import '../styles/TestPage.css';

const TestPage = () => {
    const [testData, setTestData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [isTestFinished, setIsTestFinished] = useState(false);
    const location = useLocation();
    const [userId, setUserId] = useState(null);

    // Проверяем, авторизован ли пользователь
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded && decoded.id) {
                setUserId(decoded.id);
            }
        }
    }, []);

    // Если тест начат из коллекции, используем переданные данные
    useEffect(() => {
        if (location.state?.testData) {
            setTestData(location.state.testData);
            setCurrentQuestion(0);
            setUserAnswers([]);
            setResults(null);
            setIsTestFinished(false);
        }
    }, [location.state]);

    const handleStartTest = async (testConfig) => {
        try {
            const response = await startTest(testConfig);
            setTestData(response);
            setCurrentQuestion(0);
            setUserAnswers([]);
            setResults(null);
            setIsTestFinished(false);
        } catch (error) {
            console.error('Failed to start test:', error);
            alert('Failed to start test: ' + error.message);
        }
    };

    const handleAnswer = (selectedTranslation) => {
        const currentWord = testData.words[currentQuestion];
        const answer = {
            word_id: currentWord.id,
            original: currentWord.original,
            user_translation: selectedTranslation,
        };

        const updatedAnswers = [...userAnswers, answer];
        setUserAnswers(updatedAnswers);

        if (currentQuestion + 1 < testData.words.length) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleSubmitTest = useCallback(async () => {
        try {
            const response = await submitTestAnswers(testData.test.test_id, userAnswers);
            setResults(response);
            setIsTestFinished(true);
        } catch (error) {
            console.error('Failed to submit test:', error);
            alert('Failed to submit test: ' + error.message);
        }
    }, [testData, userAnswers]);

    useEffect(() => {
        if (testData && userAnswers.length === testData.words.length) {
            handleSubmitTest();
        }
    }, [userAnswers, testData, handleSubmitTest]);

    const renderTestResults = () => {
        if (!results) return null;

        return (
            <div className="test-page fade-in">
                <h2>Test Results</h2>
                <p>Accuracy: {results.accuracy}%</p>
                <ul>
                    {userAnswers.map((answer, index) => {
                        const correctTranslation = testData.words.find((word) => word.id === answer.word_id)?.translation;
                        const isCorrect = answer.user_translation === correctTranslation;
                        return (
                            <li
                                key={index}
                                className={isCorrect ? 'correct' : 'incorrect'}
                            >
                                <strong>{answer.original}</strong> - {answer.user_translation}
                                {!isCorrect && (
                                    <span className="correct-answer">(Correct: {correctTranslation})</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <button onClick={() => handleStartTest({ hardness_level: 1, useMyDict: false })}>
                    Начать новый тест
                </button>
            </div>
        );
    };

    // Если пользователь не авторизован, показываем сообщение
    if (!userId) {
        return (
            <div className="test-page">
                <p>Пожалуйста, войдите, чтобы начать тест.</p>
            </div>
        );
    }

    return (
        <div className="test-page">
            {!testData ? (
                <TestStart onStartTest={handleStartTest} />
            ) : !isTestFinished ? (
                <TestQuestion
                    question={testData.words[currentQuestion]}
                    words={testData.words}
                    onAnswer={handleAnswer}
                />
            ) : (
                renderTestResults()
            )}
        </div>
    );
};

export default TestPage;