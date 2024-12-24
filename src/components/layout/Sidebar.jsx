import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Inicio', path: '/dashboard', icon: HomeIcon },
    ...(user?.rolActual === 'admin' ? [
      { name: 'Usuarios', path: '/dashboard/usuarios', icon: UsersIcon }
    ] : []),
    { name: 'Estadísticas', path: '/dashboard/estadisticas', icon: ChartBarIcon },
    { name: 'Configuración', path: '/dashboard/configuracion', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="bg-[#1a1a1a] text-white w-64 min-h-screen p-4 border-r border-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#646cff]">Panel Admin</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActive
                    ? 'bg-[#646cff] text-white'
                    : 'text-gray-300 hover:bg-[#646cff]/10 hover:text-[#646cff]'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}