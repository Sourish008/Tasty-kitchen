import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingCart, 
  MessageSquare,
  LogOut,
  UtensilsCrossed
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const { signOut } = useAuthStore();

  const links = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/items', icon: Utensils, label: 'Food Items' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-[var(--border-color)] flex flex-col fixed h-full z-10 transition-transform sm:translate-x-0 hidden sm:flex">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <UtensilsCrossed size={24} />
            <span>Tasty Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || 
              (link.path !== '/admin' && location.pathname.startsWith(link.path));
            
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' 
                  : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-text-main'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <button 
            onClick={signOut}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition-all w-full text-left font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:ml-64 flex flex-col min-h-screen">
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-[var(--border-color)] flex items-center justify-between px-8 sm:hidden">
          <span className="font-bold">Admin Mobile</span>
          {/* Mobile menu button could go here */}
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
