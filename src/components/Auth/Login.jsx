import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tokenData = await loginUser(formData.username, formData.password);
            localStorage.setItem('access_token', tokenData.access_token);
            onLogin({ username: formData.username, id: tokenData.user_id }); // Передаем id пользователя
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Вход
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
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Войти
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    color="secondary"
                    onClick={onSwitchToRegister}
                    sx={{ mt: 1 }}
                >
                    Нет аккаунта? Зарегистрируйтесь
                </Button>
            </form>
        </Box>
    );
};

export default Login;