import React, { useState, useEffect } from 'react';
import { getWords, createCollection } from '../services/api';
import { decodeJWT } from '../utils/jwt';
import { Typography, TextField, Checkbox, FormControlLabel, Button, Box, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const CreateCollection = () => {
    const [words, setWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [showOnlyMyWords, setShowOnlyMyWords] = useState(false);
    const [userId, setUserId] = useState(null);

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

    // Загружаем слова в зависимости от состояния чекбокса
    useEffect(() => {
        const fetchWords = async () => {
            try {
                let response;
                if (showOnlyMyWords && userId) {
                    // Загружаем только слова пользователя
                    response = await getWords(`/users/words?user_id=${userId}`);
                } else {
                    // Загружаем все слова
                    response = await getWords('/users/words');
                }
                setWords(response);
            } catch (error) {
                console.error('Ошибка загрузки слов:', error);
            }
        };

        if (userId) {
            fetchWords(); // Загружаем слова только если пользователь авторизован
        }
    }, [showOnlyMyWords, userId]);

    // Обработчик выбора слова
    const handleWordSelect = (wordId) => {
        if (selectedWords.includes(wordId)) {
            setSelectedWords(selectedWords.filter(id => id !== wordId));
        } else {
            setSelectedWords([...selectedWords, wordId]);
        }
    };

    // Обработчик создания коллекции
    const handleCreateCollection = async () => {
        if (!collectionName || selectedWords.length === 0) {
            alert('Пожалуйста, укажите название коллекции и выберите хотя бы одно слово.');
            return;
        }

        try {
            const response = await createCollection({
                name: collectionName,
                is_public: isPublic,
                words_ids: selectedWords, // Исправлено на words_ids
            });

            alert('Коллекция успешно создана!');
            setCollectionName('');
            setSelectedWords([]);
            setIsPublic(false);

            // Отображаем созданную коллекцию
            console.log('Созданная коллекция:', response);
        } catch (error) {
            console.error('Ошибка создания коллекции:', error);
        }
    };

    // Если пользователь не авторизован, показываем сообщение
    if (!userId) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Создать коллекцию
                </Typography>
                <p>Пожалуйста, войдите, чтобы создать коллекцию.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Создать коллекцию
            </Typography>

            <TextField
                fullWidth
                label="Название коллекции"
                variant="outlined"
                margin="normal"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                }
                label="Общедоступная коллекция"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={showOnlyMyWords}
                        onChange={(e) => setShowOnlyMyWords(e.target.checked)}
                    />
                }
                label="Показывать только мои слова"
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Выберите слова для коллекции:
            </Typography>

            {/* Добавляем полосу прокрутки для списка слов */}
            <Box sx={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                <List>
                    {words.map((word) => (
                        <ListItem key={word.id}>
                            <ListItemText
                                primary={`${word.original} - ${word.translation}`}
                            />
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    checked={selectedWords.includes(word.id)}
                                    onChange={() => handleWordSelect(word.id)}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCreateCollection}
                sx={{ mt: 2 }}
            >
                Создать коллекцию
            </Button>

            <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => {
                    setCollectionName('');
                    setSelectedWords([]);
                    setIsPublic(false);
                }}
                sx={{ mt: 2 }}
            >
                Создать новую коллекцию
            </Button>
        </Box>
    );
};

export default CreateCollection;