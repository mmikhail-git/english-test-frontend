import React, { useEffect, useState } from 'react';
import { getWordImage } from '../../services/api';
import { Button } from '@mui/material';

const TestQuestion = ({ question, words, onAnswer }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageBlob = await getWordImage(question.id);
                const url = URL.createObjectURL(imageBlob);
                setImageUrl(url);
            } catch (error) {
                console.error('Ошибка загрузки изображения:', error);
                setImageUrl(null);
            }
        };

        fetchImage();
    }, [question.id]);

    const getRandomTranslations = () => {
        const otherWords = words.filter((word) => word.id !== question.id);
        const randomTranslations = otherWords
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map((word) => word.translation);
        return [...randomTranslations, question.translation].sort(() => Math.random() - 0.5);
    };

    const translations = getRandomTranslations();

    const handleClick = (translation) => {
        onAnswer(translation);
    };

    return (
        <div className="test-question-container">
            <div className="question-content">
                <h2>{question.original}</h2>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={question.original}
                        style={{ maxWidth: '250px', width: '100%', height: 'auto' }}
                    />
                )}
            </div>
            <div className="translation-buttons">
                {translations.map((translation, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        color="primary"
                        onClick={() => handleClick(translation)}
                        sx={{ mt: 1, width: '100%' }}
                    >
                        {translation}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default TestQuestion;