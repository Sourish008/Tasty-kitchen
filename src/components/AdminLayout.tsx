import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingCart, 
  MessageSquare,
  LogOut,
  UtensilsCrossed,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const { signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/items', icon: Utensils, label: 'Food Items' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 xl:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-full bg-white dark:bg-gray-800 border-r border-[var(--border-color)] flex flex-col z-30
        w-64 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0 sm:flex
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl" onClick={() => setIsMobileMenuOpen(false)}>
            <UtensilsCrossed size={24} />
            <span>Tasty Admin</span>
          </Link>
          <button 
            className="sm:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
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
                onClick={() => setIsMobileMenuOpen(false)}
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
        {/* Mobile Header */}
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-[var(--border-color)] flex items-center px-4 sm:hidden justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg">Tasty Admin</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
