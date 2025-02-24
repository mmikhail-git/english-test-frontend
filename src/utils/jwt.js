export const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

export const getUserFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decoded = decodeJWT(token);
        return {
            id: decoded.id, // Извлекаем id из токена
            username: decoded.sub, // Извлекаем username (sub) из токена
            email: decoded.email, // Извлекаем email из токена (если есть)
        };
    }
    return null;
};