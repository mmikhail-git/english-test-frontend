import React, { useState } from 'react';
import { createWord, uploadWordImage } from '../../services/api'; // Импортируем uploadWordImage
import { TextField, Button, Box, Typography } from '@mui/material';

const CreateWord = ({ onWordAdded }) => {
    const [formData, setFormData] = useState({
        original: '',
        translation: '',
        image: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Сначала создаем слово
        try {
            // Создаем слово без изображения
            const wordResponse = await createWord({
                original: formData.original,
                translation: formData.translation,
            });

            // Если изображение было загружено, отправляем его отдельным запросом
            if (formData.image) {
                await uploadWordImage(wordResponse.id, formData.image); // Используем ID созданного слова
            }

            // Очищаем форму и обновляем список слов
            setFormData({ original: '', translation: '', image: null });
            onWordAdded();
        } catch (error) {
            console.error('Ошибка добавления слова:', error);
        }
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Добавить слово
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Оригинал"
                    variant="outlined"
                    margin="normal"
                    value={formData.original}
                    onChange={(e) => setFormData({ ...formData, original: e.target.value })}
                />
                <TextField
                    fullWidth
                    label="Перевод"
                    variant="outlined"
                    margin="normal"
                    value={formData.translation}
                    onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginTop: '16px' }}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Добавить слово
                </Button>
            </form>
        </Box>
    );
};

export default CreateWord;