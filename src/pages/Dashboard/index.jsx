import { useState } from 'react';
import { useSocketContext } from '../../contexts/SocketContext';
import { DashboardStats } from './components/DashboardStats';
import { ActivityChart } from './components/ActivityChart';
import { RecentActivity } from './components/RecentActivity';

export default function Dashboard() {
    const [stats, setStats] = useState({
        usuarios: 15,
        sesionesActivas: 3,
        notificaciones: 8,
        crecimiento: '+23%'
    });

    const { socket } = useSocketContext();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
                <div className="text-sm text-gray-400">Última actualización: Hace 5 minutos</div>
            </div>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityChart />
                <RecentActivity />
            </div>
        </div>
    );
}