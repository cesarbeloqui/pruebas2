const API_URL = 'http://localhost:3000/api';

export const verifyEmailToken = async (token) => {
    try {
        const response = await fetch(`${API_URL}/auth/verificar-email/${token}`);
        const data = await response.json();

        // Si el mensaje indica que el token es inválido porque ya fue usado
        // (email ya verificado), lo consideramos como un éxito
        if (data.mensaje?.includes('Token de verificación inválido') ||
            data.mensaje?.includes('ya está verificado')) {
            return {
                success: true,
                message: 'Email ya verificado',
                alreadyVerified: true
            };
        }

        if (response.ok) {
            return {
                success: true,
                message: 'Email verificado exitosamente',
                alreadyVerified: false
            };
        }

        return {
            success: false,
            error: data.mensaje || 'Error al verificar el email'
        };
    } catch (error) {
        console.error('Error en verificación:', error);
        return {
            success: false,
            error: 'Error de conexión'
        };
    }
};