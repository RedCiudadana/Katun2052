import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { FileText, MessageSquare, Settings, LogOut, LayoutDashboard, Newspaper } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin',            label: 'Resumen',        icon: LayoutDashboard, exact: true },
  { to: '/admin/documentos', label: 'Documentos',     icon: FileText },
  { to: '/admin/prensa',     label: 'Sala de Prensa', icon: Newspaper },
  { to: '/admin/comentarios',label: 'Comentarios',    icon: MessageSquare },
  { to: '/admin/encuesta',   label: 'Encuesta',       icon: Settings },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="text-white font-bold text-base">Panel Admin</div>
          <div className="text-slate-400 text-xs mt-0.5">K'atun 2032</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-3 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Administración — K'atun 2032</h1>
          <Link to="/" className="text-sm text-brand-700 hover:text-brand-800 font-medium transition-colors">
            Ver sitio
          </Link>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
