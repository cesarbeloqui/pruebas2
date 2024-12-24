import { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, UserCheck, UserX, Shield, UserX2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

export function useColumns({ onToggleEstado, onCambiarRol }) {
    return useMemo(
        () => [
            {
                accessorKey: 'nombre',
                header: 'Nombre',
                cell: info => <span className="font-medium text-white">{info.getValue()}</span>
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: info => <span className="text-gray-300">{info.getValue()}</span>
            },
            {
                accessorKey: 'rol',
                header: 'Rol',
                cell: info => (
                    <div className="flex items-center gap-2">
                        {info.getValue() === 'admin' ? (
                            <ShieldCheck className="w-4 h-4 text-[#646cff]" />
                        ) : (
                            <ShieldAlert className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={info.getValue() === 'admin' ? 'text-[#646cff]' : 'text-gray-400'}>
                            {info.getValue()}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'activo',
                header: 'Estado',
                cell: info => (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${info.getValue() ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {info.getValue() ? (
                            <>
                                <UserCheck className="w-3 h-3" />
                                Activo
                            </>
                        ) : (
                            <>
                                <UserX className="w-3 h-3" />
                                Inactivo
                            </>
                        )}
                    </span>
                ),
            },
            {
                id: 'acciones',
                header: 'Acciones',
                cell: info => {
                    const usuario = info.row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <button
                                className={`p-1.5 rounded-full transition-colors ${usuario.rol === 'admin'
                                    ? 'text-yellow-500 hover:bg-yellow-500/10'
                                    : 'text-gray-400 hover:bg-gray-400/10'
                                    }`}
                                onClick={() => onCambiarRol(usuario.id, usuario.rol === 'admin' ? 'usuario' : 'admin')}
                                title={usuario.rol === 'admin' ? 'Hacer Usuario' : 'Hacer Administrador'}
                            >
                                <Shield className="w-5 h-5" />
                            </button>
                            <button
                                className={`p-1.5 rounded-full transition-colors ${usuario.activo
                                    ? 'text-red-500 hover:bg-red-500/10'
                                    : 'text-green-500 hover:bg-green-500/10'
                                    }`}
                                onClick={() => onToggleEstado(usuario.id)}
                                title={usuario.activo ? 'Desactivar Usuario' : 'Activar Usuario'}
                            >
                                <UserX2 className="w-5 h-5" />
                            </button>
                        </div>
                    );
                },
            },
        ],
        [onToggleEstado, onCambiarRol]
    );
}