import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsersIcon, ActivityIcon, BellIcon, TrendingUpIcon } from 'lucide-react';

const mockData = [
  { name: 'Lun', usuarios: 4, sesiones: 3 },
  { name: 'Mar', usuarios: 6, sesiones: 4 },
  { name: 'Mie', usuarios: 8, sesiones: 6 },
  { name: 'Jue', usuarios: 7, sesiones: 5 },
  { name: 'Vie', usuarios: 10, sesiones: 8 },
  { name: 'Sab', usuarios: 12, sesiones: 9 },
  { name: 'Dom', usuarios: 15, sesiones: 11 },
];

const actividadReciente = [
  { id: 1, usuario: 'María García', accion: 'Inicio de sesión', tiempo: 'Hace 5 minutos' },
  { id: 2, usuario: 'Juan Pérez', accion: 'Actualización de perfil', tiempo: 'Hace 15 minutos' },
  { id: 3, usuario: 'Ana López', accion: 'Registro nuevo', tiempo: 'Hace 30 minutos' },
  { id: 4, usuario: 'Carlos Ruiz', accion: 'Cambio de contraseña', tiempo: 'Hace 1 hora' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 15,
    sesionesActivas: 3,
    notificaciones: 8,
    crecimiento: '+23%'
  });
  
  const socket = useSocket();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
        <div className="text-sm text-gray-500">Última actualización: Hace 5 minutos</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <UsersIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usuarios}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑12%</span> desde el último mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
            <ActivityIcon className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sesionesActivas}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑8%</span> desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <BellIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notificaciones}</div>
            <p className="text-xs text-muted-foreground">
              +3 nuevas desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Crecimiento</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.crecimiento}</div>
            <p className="text-xs text-muted-foreground">
              En los últimos 30 días
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usuarios" stroke="#646cff" strokeWidth={2} />
                  <Line type="monotone" dataKey="sesiones" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actividadReciente.map((actividad) => (
                <div key={actividad.id} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <UsersIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{actividad.usuario}</p>
                    <p className="text-xs text-gray-500">{actividad.accion}</p>
                  </div>
                  <div className="text-xs text-gray-500">{actividad.tiempo}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}