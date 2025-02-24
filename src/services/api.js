import axios from 'axios';
import { decodeJWT } from '../utils/jwt';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Базовый URL для всех запросов
});


export const loginUser = async (username, password) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    try {
        const response = await api.post('/auth/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data; // Предполагаем, что сервер возвращает access_token и user_id
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/', userData);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        throw error;
    }
};


// Функция для получения текущего пользователя
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/read_current_user');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        throw error;
    }
};


export const createWord = async (wordData) => {
    try {
        const response = await api.post('/word', wordData, {
            headers: {
                'Content-Type': 'application/json', // Указываем тип контента
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create word:', error);
        throw error;
    }
};

export const uploadWordImage = async (wordId, imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile); // Используем ключ 'file' вместо 'image'

    try {
        const response = await api.post(`/upload-image/${wordId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Указываем тип контента
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
    }
};

export const getWordImage = async (wordId) => {
    try {
        const response = await api.get(`/word/${wordId}/image`, {
            responseType: 'blob', // Указываем, что ожидаем бинарные данные
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch image:', error);
        throw error;
    }
};

// Функция для получения списка слов
/* export const getWords = async () => {
    const userId = getUserIdFromToken(); // Извлекаем user_id из токена
    if (!userId) {
        throw new Error('User ID is missing');
    }

    try {
        const response = await api.get(`/users/words/?user_id=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch words:', error);
        throw error;
    }
}; */

export const getWords = async (endpoint = '/users/words') => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки слов:', error);
        throw error;
    }
};


// Функция для создания теста
export const startTest = async (testData) => {
    try {
        const response = await api.post('/test', testData);
        return response.data;
    } catch (error) {
        console.error('Failed to start test:', error);
        throw error;
    }
};

// Функция для получения информации о тесте
export const getTest = async (testId) => {
    try {
        const response = await api.get(`/test/${testId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch test:', error);
        throw error;
    }
};

// Функция для получения всех тестов пользователя
export const getAllTestsByUser = async () => {
    const userId = getUserIdFromToken(); // Извлекаем user_id из токена
    if (!userId) {
        throw new Error('User ID is missing');
    }

    try {
        const response = await api.get(`/test/${userId}/all_test`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user tests:', error);
        throw error;
    }
};

// Функция для получения результатов теста
export const getTestResults = async (testId) => {
    try {
        const response = await api.get(`/test/${testId}/results`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch test results:', error);
        throw error;
    }
};

// Функция для отправки результатов теста
export const submitTestAnswers = async (testId, answers) => {
    try {
        const response = await api.post(`/test/${testId}/check`, { answer: answers });
        return response.data;
    } catch (error) {
        console.error('Failed to submit test answers:', error);
        throw error;
    }
};

// Добавляем interceptor для автоматической подстановки токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const getUserTests = async (userId) => {
    try {
        const response = await api.get(`/test/${userId}/all_test`);
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки тестов:', error);
        throw error;
    }
};

const getUserIdFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decoded = decodeJWT(token);
        console.log('Decoded token:', decoded); // Отладочный вывод
        return decoded?.user_id || decoded?.id || null; // Ищем user_id или id в токене
    }
    return null;
};


// Метод для получения коллекций
export const getCollections = async (params = {}) => {
    try {
        const response = await api.get('/collection/all', { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки коллекций:', error);
        throw error;
    }
};

// Запуск теста из коллекции
export const startTestFromCollection = async (collectionId) => {
    try {
        const response = await api.post('/test_from_collections', { collections_id: collectionId });
        return response.data;
    } catch (error) {
        console.error('Ошибка запуска теста:', error);
        throw error;
    }
};

export const createCollection = async (collectionData) => {
    try {
        const response = await api.post('/collection', collectionData);
        return response.data;
    } catch (error) {
        console.error('Ошибка создания коллекции:', error);
        throw error;
    }
};

export default api;