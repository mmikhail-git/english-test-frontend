// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Синий цвет
        },
        secondary: {
            main: '#ff4081', // Розовый цвет
        },
        background: {
            default: '#e3f2fd', // Светло-голубой фон
        },
    },
    typography: {

        h1: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1976d2',
        },
        h2: {
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#1976d2',
        },
        button: {
            textTransform: 'none', // Убираем автоматическое преобразование текста к верхнему регистру
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px', // Закругленные кнопки
                    padding: '10px 20px',
                },
            },
        },
    },
});

export default theme;