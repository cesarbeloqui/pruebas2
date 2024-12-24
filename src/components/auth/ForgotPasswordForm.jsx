import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.mensaje);
                setEmail('');
            } else {
                setError(data.mensaje);
            }
        } catch (error) {
            setError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#242424] px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-800">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
                        <p className="text-gray-400">Ingresa tu correo electrónico para recibir instrucciones</p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                            <p className="text-green-500 text-sm">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                required
                            />
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