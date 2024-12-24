import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { FormError, FieldError } from '../ui/form-error';
import { useFormError } from '../../hooks/useFormError';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error, fieldErrors, handleError, clearErrors } = useFormError();

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!formData.email) {
      handleError('El email es requerido', 'email');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      handleError('Email inválido', 'email');
      isValid = false;
    }

    if (!formData.password) {
      handleError('La contraseña es requerida', 'password');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    clearErrors();

    const result = await login(formData);
    if (!result.success) {
      handleError(result.error);
    }
    setLoading(false);
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
            <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido!</h1>
            <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
          </div>

          <FormError error={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FieldError error={fieldErrors.email} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#646cff] hover:text-[#747bff] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FieldError error={fieldErrors.password} />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Procesando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/registro"
                className="text-[#646cff] hover:text-[#747bff] transition-colors font-medium"
              >
                Regístrate aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}