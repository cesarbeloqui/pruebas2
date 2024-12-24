import { Button } from '../../ui/button';

const statusConfig = {
    verifying: {
        title: 'Verificando tu email...',
        message: 'Por favor espera mientras verificamos tu dirección de correo electrónico.',
        showButton: false
    },
    success: {
        title: '¡Email verificado!',
        showButton: true
    },
    error: {
        title: 'Error de verificación',
        showButton: true
    }
};

export function VerificationStatus({ status, error, isAlreadyVerified, onNavigateToLogin }) {
    const content = statusConfig[status];

    if (!content) {
        return null;
    }

    const getMessage = () => {
        if (status === 'error') return error;
        if (status === 'success') {
            return isAlreadyVerified
                ? 'Tu dirección de correo electrónico ya estaba verificada.'
                : 'Tu dirección de correo electrónico ha sido verificada exitosamente.';
        }
        return content.message;
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>
            <p className="text-gray-400 mb-6">{getMessage()}</p>
            {content.showButton && (
                <Button onClick={onNavigateToLogin}>
                    Ir al inicio de sesión
                </Button>
            )}
        </>
    );
}