import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    const cargarUsuarios = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/usuarios', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                throw new Error('Error al cargar usuarios');
            }
        } catch (error) {
            toast.error('Error al cargar usuarios');
            console.error('Error al cargar usuarios:', error);
        }
    }, []);

    const toggleEstadoUsuario = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/usuarios/${id}/toggle`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                await cargarUsuarios();
                toast.success(data.mensaje);
            } else {
                throw new Error(data.mensaje);
            }
        } catch (error) {
            toast.error(error.message || 'Error al cambiar estado del usuario');
            console.error('Error al cambiar estado del usuario:', error);
        }
    };

    const cambiarRolUsuario = async (id, nuevoRol) => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/usuarios/${id}/rol`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rol: nuevoRol })
            });

            const data = await response.json();

            if (response.ok) {
                await cargarUsuarios();
                toast.success(data.mensaje);
            } else {
                throw new Error(data.mensaje);
            }
        } catch (error) {
            toast.error(error.message || 'Error al cambiar rol del usuario');
            console.error('Error al cambiar rol del usuario:', error);
        }
    };

    return {
        usuarios,
        cargarUsuarios,
        toggleEstadoUsuario,
        cambiarRolUsuario
    };
}