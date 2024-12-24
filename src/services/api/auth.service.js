const API_URL = 'http://localhost:3000/api';

export const verifyEmail = async (token) => {
    try {
        if (!token) {
            return {
                success: false,
                data: null,
                error: 'Token no proporcionado'
            };
        }

        const response = await fetch(`${API_URL}/auth/verificar-email/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                data: null,
                error: data.mensaje || 'Error al verificar el email'
            };
        }

        return {
            success: true,
            data,
            error: null
        };
    } catch (error) {
        console.error('Error en verifyEmail:', error);
        return {
            success: false,
            data: null,
            error: 'Error al verificar el email'
        };
    }
};