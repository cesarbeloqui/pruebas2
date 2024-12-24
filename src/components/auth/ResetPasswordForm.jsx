import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { FormError, FieldError } from '../ui/form-error';
import { useFormError } from '../../hooks/useFormError';

export default function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { error, fieldErrors, handleError, clearErrors } = useFormError();

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!formData.password) {
            handleError('La contraseña es requerida', 'password');
            isValid = false;
        } else if (formData.password.length < 6) {
            handleError('La contraseña debe tener al menos 6 caracteres', 'password');
            isValid = false;
        }

        if (!formData.confirmPassword) {
            handleError('Confirma tu contraseña', 'confirmPassword');
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            handleError('Las contraseñas no coinciden', 'confirmPassword');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        clearErrors();

        try {
            const response = await fetch('http://localhost:3000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: formData.password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login', {
                    state: { message: 'Contraseña actualizada exitosamente' }
                });
            } else {
                handleError(data.mensaje);
            }
        } catch (error) {
            handleError('Error al restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            handleError('', name);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#242424] px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-800">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Nueva Contraseña</h1>
                        <p className="text-gray-400">Ingresa tu nueva contraseña</p>
                    </div>

                    <FormError error={error} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva contraseña</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <FieldError error={fieldErrors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <FieldError error={fieldErrors.confirmPassword} />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}