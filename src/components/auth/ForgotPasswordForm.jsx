import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ArrowLeft } from 'lucide-react';
import { FormError, FieldError } from '../ui/form-error';
import { useFormError } from '../../hooks/useFormError';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { error, fieldErrors, handleError, clearErrors } = useFormError();

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!email) {
            handleError('El email es requerido', 'email');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            handleError('Email inválido', 'email');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        clearErrors();
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.mensaje);
                setEmail('');
            } else {
                handleError(data.mensaje);
            }
        } catch (error) {
            handleError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#242424] px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-800">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Volver al inicio de sesión
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
                        <p className="text-gray-400">Ingresa tu correo electrónico para recibir instrucciones</p>
                    </div>

                    <FormError error={error} />

                    {success && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                            <p className="text-green-500 text-sm">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        handleError('', 'email');
                                    }
                                }}
                                placeholder="ejemplo@correo.com"
                                required
                            />
                            <FieldError error={fieldErrors.email} />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar instrucciones'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}