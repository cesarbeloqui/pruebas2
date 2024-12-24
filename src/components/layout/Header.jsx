import UserMenu from './UserMenu';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
        <UserMenu />
      </div>
    </header>
  );
}