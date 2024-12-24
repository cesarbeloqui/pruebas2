import UserMenu from './UserMenu';

export default function Header() {
  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800">
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-semibold text-white">Panel de Administración</h1>
        <UserMenu />
      </div>
    </header>
  );
}