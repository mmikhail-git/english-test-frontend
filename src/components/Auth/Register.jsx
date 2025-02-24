import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import { TextField, Button, Box, Typography } from '@mui/material';

const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            console.log('Регистрация прошла успешно!');
            onSwitchToLogin(); // Переход к форме входа после успешной регистрации
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Регистрация
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Имя пользователя"
                    variant="outlined"
                    margin="normal"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <TextField
                    fullWidth
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Зарегистрироваться
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    color="secondary"
                    onClick={onSwitchToLogin}
                    sx={{ mt: 1 }}
                >
                    Уже есть аккаунт? Войти
                </Button>
            </form>
        </Box>
    );
};

export default Register;