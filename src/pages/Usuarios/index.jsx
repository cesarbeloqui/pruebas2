import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PlusIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { UsuariosTable } from './components/UsuariosTable';
import { useUsuarios } from './hooks/useUsuarios';

export default function Usuarios() {
    const { user } = useAuth();
    const { usuarios, cargarUsuarios, toggleEstadoUsuario, cambiarRolUsuario } = useUsuarios();

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]);

    if (user?.rolActual !== 'admin') {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h2>
                <p className="text-gray-400">No tienes permisos para ver esta página.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
                <Button className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar Usuario</span>
                </Button>
            </div>

            <UsuariosTable
                usuarios={usuarios}
                onToggleEstado={toggleEstadoUsuario}
                onCambiarRol={cambiarRolUsuario}
            />
        </div>
    );
}