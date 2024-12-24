import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { UsersIcon } from 'lucide-react';

export const actividadReciente = [
    { id: 1, usuario: 'María García', accion: 'Inicio de sesión', tiempo: 'Hace 5 minutos' },
    { id: 2, usuario: 'Juan Pérez', accion: 'Actualización de perfil', tiempo: 'Hace 15 minutos' },
    { id: 3, usuario: 'Ana López', accion: 'Registro nuevo', tiempo: 'Hace 30 minutos' },
    { id: 4, usuario: 'Carlos Ruiz', accion: 'Cambio de contraseña', tiempo: 'Hace 1 hora' },
];

export const RecentActivity = () => (
    <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
            <CardTitle className="text-gray-200">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {actividadReciente.map((actividad) => (
                    <ActivityItem key={actividad.id} {...actividad} />
                ))}
            </div>
        </CardContent>
    </Card>
);

const ActivityItem = ({ usuario, accion, tiempo }) => (
    <div className="flex items-center space-x-4 border-b border-gray-800 pb-4 last:border-0">
        <div className="bg-[#646cff]/10 p-2 rounded-full">
            <UsersIcon className="h-4 w-4 text-[#646cff]" />
        </div>
        <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-gray-200">{usuario}</p>
            <p className="text-xs text-gray-400">{accion}</p>
        </div>
        <div className="text-xs text-gray-400">{tiempo}</div>
    </div>
);