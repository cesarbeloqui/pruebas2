import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Inicio', path: '/dashboard', icon: HomeIcon },
  { name: 'Usuarios', path: '/dashboard/usuarios', icon: UsersIcon },
  { name: 'Estadísticas', path: '/dashboard/estadisticas', icon: ChartBarIcon },
  { name: 'Configuración', path: '/dashboard/configuracion', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Panel Admin</h2>
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
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700' : ''
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