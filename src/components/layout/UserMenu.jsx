import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
    ChevronDown,
    LogOut,
    UserCog
} from 'lucide-react';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, switchRole } = useAuth();

    // Verificar si el usuario tiene permisos de administrador
    const tienePermisosAdmin = user?.rol === 'admin' || user?.rolOriginal === 'admin';

    const handleSwitchRole = async () => {
        const success = await switchRole();
        if (success) {
            setIsOpen(false);
        }
    };
    console.log(user);

    return (
        <div className="relative">
            <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{user?.nombre}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {tienePermisosAdmin && (
                        <button
                            onClick={handleSwitchRole}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <UserCog className="w-4 h-4 mr-2" />
                            {user.rol === 'admin' ? 'Cambiar a usuario común' : 'Cambiar a administrador'}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}