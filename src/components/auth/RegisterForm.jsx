import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { FormError, FieldError } from '../ui/form-error';
import { useFormError } from '../../hooks/useFormError';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { error, fieldErrors, handleError, clearErrors } = useFormError();
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!formData.nombre) {
      handleError('El nombre es requerido', 'nombre');
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      handleError('La contraseña debe tener al menos 6 caracteres', 'password');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    clearErrors();
    setIsEmailRegistered(false);

    try {
      const response = await fetch('http://localhost:3000/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredEmail(formData.email);
        setFormData({ nombre: '', email: '', password: '' });
      } else {
        if (data.mensaje === 'El email ya está registrado') {
          setIsEmailRegistered(true);
        }
        handleError(data.mensaje);
      }
    } catch (error) {
      handleError('Error al registrar usuario');
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
    if (name === 'email') {
      setIsEmailRegistered(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#242424] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Crear cuenta</h1>
            <p className="text-gray-400">Completa tus datos para registrarte</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
              {isEmailRegistered && (
                <p className="mt-2 text-sm text-gray-400">
                  ¿Querés recuperar tu contraseña?{' '}
                  <Link
                    to="/forgot-password"
                    className="text-[#646cff] hover:text-[#747bff] transition-colors font-medium"
                  >
                    Click aquí
                  </Link>
                </p>
              )}
            </div>
          )}

          {registeredEmail && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <p className="text-green-500 text-sm">
                Registro exitoso. Por favor verifica tu correo electrónico.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <FieldError error={fieldErrors.nombre} />
            </div>

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
              <Label htmlFor="password">Contraseña</Label>
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
              {loading ? 'Procesando...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-[#646cff] hover:text-[#747bff] transition-colors font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}