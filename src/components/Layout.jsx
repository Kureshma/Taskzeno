import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Menu } from 'lucide-react';
import { useState } from 'react';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background text-slate-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-slate-100 px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="TaskZeno Logo" className="w-8 h-8 rounded-lg object-contain shadow-sm bg-white" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              TaskZeno
            </span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 shrink-0 lg:px-8 shadow-sm">
          <button 
            className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-auto bg-background p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
