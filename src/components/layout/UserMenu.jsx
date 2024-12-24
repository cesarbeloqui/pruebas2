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

    const esAdmin = user?.rolOriginal === 'admin';

    const handleSwitchRole = async () => {
        const success = await switchRole();
        if (success) {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-200 hover:text-white hover:bg-[#242424]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{user?.nombre}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg border border-gray-800 shadow-lg py-1 z-50">
                    {esAdmin && (
                        <button
                            onClick={handleSwitchRole}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#242424] hover:text-white transition-colors"
                        >
                            <UserCog className="w-4 h-4 mr-2" />
                            {user.rolActual === 'admin' ? 'Ver como usuario común' : 'Ver como administrador'}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#242424] hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}