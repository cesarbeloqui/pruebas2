import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PlusIcon, TrashIcon, UserIcon, ShieldIcon } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/usuarios', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const toggleEstadoUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/usuarios/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        cargarUsuarios();
      }
    } catch (error) {
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
      if (response.ok) {
        cargarUsuarios();
      }
    } catch (error) {
      console.error('Error al cambiar rol del usuario:', error);
    }
  };

  if (user?.rolActual !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
        <p className="text-gray-600">No tienes permisos para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <Button className="flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Agregar Usuario</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span>{usuario.nombre}</span>
                </div>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => cambiarRolUsuario(usuario.id, usuario.rol === 'admin' ? 'usuario' : 'admin')}
                >
                  <ShieldIcon className={`w-4 h-4 ${usuario.rol === 'admin' ? 'text-purple-600' : 'text-blue-600'}`} />
                  <span className={`text-xs ${usuario.rol === 'admin' ? 'text-purple-600' : 'text-blue-600'}`}>
                    {usuario.rol}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={usuario.activo ? 'text-red-600' : 'text-green-600'}
                  onClick={() => toggleEstadoUsuario(usuario.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{usuario.email}</p>
              <p className="text-xs text-gray-400">
                Registrado el: {new Date(usuario.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}