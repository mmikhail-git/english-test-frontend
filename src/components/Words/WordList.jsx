import React, { useEffect, useState } from 'react';
import { getWordImage } from '../../services/api';

const WordList = ({ words }) => {
    const [images, setImages] = useState({}); // Состояние для хранения изображений

    // Функция для загрузки изображения
    const fetchImage = async (wordId) => {
        try {
            const imageBlob = await getWordImage(wordId);
            const imageUrl = URL.createObjectURL(imageBlob); // Создаем URL для изображения
            setImages((prev) => ({ ...prev, [wordId]: imageUrl }));
        } catch (error) {
            console.error('Failed to fetch image:', error);
        }
    };

    // Загружаем изображения для слов, у которых они есть
    useEffect(() => {
        words.forEach((word) => {
            if (word.has_image) { // Предполагаем, что в ответе есть поле has_image
                fetchImage(word.id);
            }
        });
    }, [words]);

    return (
        <ul>
            {words.map((word) => (
                <li key={word.id}>
                    <div>
                        <strong>{word.original}</strong> - {word.translation}
                    </div>
                    {images[word.id] && (
                        <img
                            src={images[word.id]} // Используем URL для отображения изображения
                            alt={word.original}
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default WordList;