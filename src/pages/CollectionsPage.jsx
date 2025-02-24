import React, { useState, useEffect } from 'react';
import { getCollections, startTestFromCollection } from '../services/api';
import { decodeJWT } from '../utils/jwt';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [userId, setUserId] = useState(null);
    const [tabValue, setTabValue] = useState(0); // 0 - общедоступные, 1 - личные
    const navigate = useNavigate();

    // Извлекаем user_id из токена
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded && decoded.id) {
                setUserId(decoded.id);
            }
        }
    }, []);

    // Загружаем коллекции в зависимости от выбранной вкладки
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                let response;
                if (tabValue === 0) {
                    // Загружаем общедоступные коллекции
                    response = await getCollections();
                } else {
                    // Загружаем личные коллекции пользователя
                    response = await getCollections({ owner_id: userId });
                }
                setCollections(response);
            } catch (error) {
                console.error('Ошибка загрузки коллекций:', error);
            }
        };

        if (userId) {
            fetchCollections(); // Загружаем коллекции только если пользователь авторизован
        }
    }, [tabValue, userId]);

    // Обработчик нажатия на коллекцию
    const handleCollectionClick = (collection) => {
        setSelectedCollection(collection);
    };

    // Обработчик нажатия на кнопку "Тест"
    const handleTestClick = async (collectionId) => {
        try {
            // Запускаем тест из коллекции
            const testData = await startTestFromCollection(collectionId);

            // Перенаправляем пользователя на страницу тестирования
            navigate('/test', { state: { testData } });
        } catch (error) {
            console.error('Ошибка запуска теста:', error);
        }
    };

    // Обработчик изменения вкладки
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Если пользователь не авторизован, показываем сообщение
    if (!userId) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Коллекции
                </Typography>
                <p>Пожалуйста, войдите, чтобы просмотреть коллекции.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Коллекции
            </Typography>

            {/* Табы для переключения между общедоступными и личными коллекциями */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="коллекции"
                sx={{
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#1976d2', // Цвет индикатора активной вкладки
                    },
                }}
            >
                <Tab
                    label="Общедоступные коллекции"
                    sx={{
                        textTransform: 'none', // Убираем преобразование текста в верхний регистр
                        fontSize: '1rem', // Размер шрифта
                        color: tabValue === 0 ? '#1976d2' : 'inherit', // Цвет текста активной/неактивной вкладки
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)', // Фон при наведении
                        },
                    }}
                />
                <Tab
                    label="Личные коллекции"
                    sx={{
                        textTransform: 'none', // Убираем преобразование текста в верхний регистр
                        fontSize: '1rem', // Размер шрифта
                        color: tabValue === 1 ? '#1976d2' : 'inherit', // Цвет текста активной/неактивной вкладки
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)', // Фон при наведении
                        },
                    }}
                />
            </Tabs>

            {/* Отображение коллекций в зависимости от выбранной вкладки */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collections.map((collection) => (
                            <React.Fragment key={collection.id}>
                                <TableRow onClick={() => handleCollectionClick(collection)}>
                                    <TableCell>{collection.name}</TableCell>
                                    <TableCell>{new Date(collection.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTestClick(collection.id);
                                            }}
                                        >
                                            Тест
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {selectedCollection?.id === collection.id && (
                                    <TableRow>
                                        <TableCell colSpan={3}>
                                            <Typography variant="h6">Содержимое коллекции:</Typography>
                                            <ul>
                                                {collection.words.map((word) => (
                                                    <li key={word.id}>
                                                        <strong>{word.original}</strong> - {word.translation}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CollectionsPage;