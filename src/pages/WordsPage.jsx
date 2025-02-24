import React, { useEffect, useState } from 'react';
import { getWords } from '../services/api';
import WordList from '../components/Words/WordList';
import CreateWord from '../components/Words/CreateWord';
import { decodeJWT } from '../utils/jwt'; // Импортируем decodeJWT

const WordsPage = () => {
    const [words, setWords] = useState([]);
    const [userId, setUserId] = useState(null); // Состояние для хранения user_id

    // Проверяем, авторизован ли пользователь
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded && decoded.id) {
                setUserId(decoded.id); // Устанавливаем user_id из токена
            }
        }
    }, []);

    // Выносим fetchWords за пределы useEffect
    const fetchWords = async () => {
        try {
            const response = await getWords();
            setWords(response);
        } catch (error) {
            console.error('Ошибка загрузки слов:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchWords(); // Вызываем fetchWords только если пользователь авторизован
        }
    }, [userId]);

    // Если пользователь не авторизован, показываем сообщение
    if (!userId) {
        return (
            <div>
                <p>Пожалуйста, войдите, чтобы просмотреть слова и добавить новые.</p>
            </div>
        );
    }

    return (
        <div>
            <CreateWord onWordAdded={fetchWords} /> {/* Передаем fetchWords как колбэк */}
            <WordList words={words} />
        </div>
    );
};

export default WordsPage;