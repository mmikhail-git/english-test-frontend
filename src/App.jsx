import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TestPage from './pages/TestPage';
import WordsPage from './pages/WordsPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CollectionsPage from './pages/CollectionsPage';
import CreateCollection from './pages/CreateCollection';
import { getUserFromToken } from './utils/jwt';
import './styles/App.css';

function App() {
    const [user, setUser] = useState(null);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const userData = getUserFromToken();
        if (userData) {
            setUser(userData);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token'); // Удаляем токен
        setUser(null); // Сбрасываем состояние пользователя
    };

    return (
        <Router>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="container">
                {user ? (
                    <>
                        <p>Добро пожаловать, {user.username}!</p>
                    </>
                ) : (
                    <>
                        {showRegister ? (
                            <Register onSwitchToLogin={() => setShowRegister(false)} />
                        ) : (
                            <Login
                                onLogin={(userData) => setUser(userData)}
                                onSwitchToRegister={() => setShowRegister(true)}
                            />
                        )}
                    </>
                )}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile key={user?.id} user={user} />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/words" element={<WordsPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/create-collection" element={<CreateCollection />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;