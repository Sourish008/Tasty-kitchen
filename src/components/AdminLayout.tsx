import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from '../stores/useToastStore';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingCart, 
  MessageSquare,
  LogOut,
  UtensilsCrossed,
  Menu,
  X,
  Home
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { path: '/admin',         icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/items',   icon: Utensils,        label: 'Food Items' },
    { path: '/admin/orders',  icon: ShoppingCart,    label: 'Orders' },
    { path: '/admin/reviews', icon: MessageSquare,   label: 'Reviews' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.info('Signed out', 'You have been signed out successfully.');
    navigate('/');
  };

  const closeSidebar = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800
        border-r border-[var(--border-color)] flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border-color)] shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary-600 font-bold text-lg"
            onClick={closeSidebar}
          >
            <UtensilsCrossed size={22} />
            <span className="truncate">Rumela's Admin</span>
          </Link>
          <button
            className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.path ||
              (link.path !== '/admin' && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-text-main'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[var(--border-color)] space-y-1 shrink-0">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-text-main transition-all font-medium text-sm"
          >
            <Home size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition-all w-full text-left font-medium text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Mobile Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-[var(--border-color)] flex items-center justify-between px-4 lg:hidden shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <span className="font-bold text-base text-text-h">Rumela's Admin</span>
          </div>
          <Link to="/" className="text-text-muted hover:text-primary-600 transition-colors p-2">
            <Home size={20} />
          </Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
