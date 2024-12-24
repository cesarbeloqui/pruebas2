import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { UsersIcon, ActivityIcon, BellIcon, TrendingUpIcon } from 'lucide-react';

export const DashboardStats = ({ stats }) => {
    const statsConfig = [
        {
            title: 'Usuarios Totales',
            value: stats.usuarios,
            icon: UsersIcon,
            trend: '↑12%',
            trendText: 'desde el último mes'
        },
        {
            title: 'Sesiones Activas',
            value: stats.sesionesActivas,
            icon: ActivityIcon,
            trend: '↑8%',
            trendText: 'desde ayer'
        },
        {
            title: 'Notificaciones',
            value: stats.notificaciones,
            icon: BellIcon,
            trend: '+3',
            trendText: 'nuevas desde ayer'
        },
        {
            title: 'Tasa de Crecimiento',
            value: stats.crecimiento,
            icon: TrendingUpIcon,
            trendText: 'En los últimos 30 días'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, trend, trendText }) => (
    <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">{title}</CardTitle>
            <Icon className="h-4 w-4 text-[#646cff]" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-gray-400">
                {trend && <span className="text-green-500">{trend}</span>} {trendText}
            </p>
        </CardContent>
    </Card>
);