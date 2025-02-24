import React from 'react';
import { Button } from '@mui/material'; // Импортируем Button

const Logout = ({ onLogout }) => {
    const handleLogout = () => {
        onLogout();
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleLogout}>
            Выйти
        </Button>
    );
};

export default Logout;