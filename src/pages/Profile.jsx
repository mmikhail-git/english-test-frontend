import React, { useState, useEffect } from 'react';
import { getUserTests } from '../services/api';
import TestHistory from '../components/Tests/TestHistory';
import TestDetails from '../components/Tests/TestDetails';
import { decodeJWT } from '../utils/jwt'; // Импортируем decodeJWT

const Profile = () => {
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [tests, setTests] = useState([]);
    const [userId, setUserId] = useState(null); // Состояние для хранения user_id

    // Извлекаем user_id из токена при монтировании компонента
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded && decoded.id) {
                setUserId(decoded.id); // Устанавливаем user_id из токена
            }
        }
    }, []);

    // Загружаем тесты, когда user_id доступен
    useEffect(() => {
        if (userId) {
            const fetchTests = async () => {
                try {
                    const response = await getUserTests(userId);
                    console.log('Тесты загружены:', response);
                    setTests(response);
                } catch (error) {
                    console.error('Ошибка загрузки тестов:', error);
                }
            };

            fetchTests();
        }
    }, [userId]);

    // Если токен отсутствует или user_id не найден, показываем сообщение
    if (!userId) {
        return <p>Пожалуйста, войдите, чтобы просмотреть ваш профиль.</p>;
    }

    return (
        <div>
            {tests.length > 0 ? (
                <>
                    <TestHistory tests={tests} onTestSelect={setSelectedTestId} />
                    {selectedTestId && <TestDetails testId={selectedTestId} />}
                </>
            ) : (
                <p>Тестов не найдено.</p>
            )}
        </div>
    );
};

export default Profile;