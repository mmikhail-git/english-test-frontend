import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav style={{ backgroundColor: '#1976d2', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HomeIcon /> Главная
            </Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PersonIcon /> Результаты {/* Изменено с "Профиль" на "Результаты" */}
            </Link>
            <Link to="/test" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SchoolIcon /> Тест
            </Link>
            <Link to="/words" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookIcon /> Слова
            </Link>
            <Link to="/collections" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CollectionsIcon /> Коллекции
            </Link>
            <Link to="/create-collection" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AddIcon /> Создать коллекцию
            </Link>
            {user && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onLogout}
                    style={{ marginLeft: 'auto' }}
                >
                    Выйти
                </Button>
            )}
        </nav>
    );
};

export default Navbar;