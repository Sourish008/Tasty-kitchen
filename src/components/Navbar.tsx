import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, LogOut, Settings, Menu as MenuIcon, X } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { toast } from '../stores/useToastStore';

const Navbar = () => {
  const { session, role, signOut } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.info('Signed out', 'You have been signed out successfully.');
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-primary-600 font-heading font-bold text-2xl tracking-tight transition-transform hover:scale-105 active:scale-95">
            <UtensilsCrossed size={28} />
            <span>Rumela's Kitchen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link to="/" className="text-text-main font-medium hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/menu" className="text-text-main font-medium hover:text-primary-600 transition-colors">Menu</Link>
            <Link to="/special" className="text-text-main font-medium hover:text-primary-600 transition-colors">Specials</Link>
            <Link to="/reviews" className="text-text-main font-medium hover:text-primary-600 transition-colors">Reviews</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {role === 'admin' && (
              <Link to="/admin" onClick={closeMenu} className="hidden sm:flex text-text-muted hover:text-primary-600 transition-colors" title="Admin Dashboard">
                <Settings size={20} />
              </Link>
            )}

            <Link to="/cart" onClick={closeMenu} className="relative p-2 text-text-main hover:text-primary-600 transition-colors">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full shadow-sm">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {session ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
                <Link to="/account" onClick={closeMenu} className="p-2 text-text-main hover:text-primary-600 transition-colors" title="Account">
                  <User size={20} />
                </Link>
                <button onClick={handleSignOut} className="p-2 text-text-muted hover:text-red-500 transition-colors" title="Sign Out">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex pl-2 border-l border-[var(--border-color)]">
                <Link to="/login" onClick={closeMenu} className="btn-primary text-sm shadow-sm py-1.5 px-4 font-medium">Log In</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-text-main hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-[var(--border-color)] shadow-xl absolute w-full left-0">
          <div className="pt-2 pb-6 px-4 space-y-4 flex flex-col">
            <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:bg-gray-50 dark:hover:bg-gray-800">Home</Link>
            <Link to="/menu" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:bg-gray-50 dark:hover:bg-gray-800">Menu</Link>
            <Link to="/special" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:bg-gray-50 dark:hover:bg-gray-800">Specials</Link>
            <Link to="/reviews" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-text-main hover:bg-gray-50 dark:hover:bg-gray-800">Reviews</Link>
            
            <div className="border-t border-[var(--border-color)] pt-4 mt-2">
              {session ? (
                <>
                  <div className="flex items-center px-3 mb-4">
                    <div className="text-sm rounded-full bg-primary-100 text-primary-800 px-3 py-1 font-medium">{session.user.email}</div>
                  </div>
                  {role === 'admin' && (
                    <Link to="/admin" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Settings size={20} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/account" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-text-main hover:bg-gray-50 dark:hover:bg-gray-800">
                    <User size={20} /> My Account
                  </Link>
                  <button onClick={() => { handleSignOut(); closeMenu(); }} className="flex w-full text-left items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} className="flex justify-center w-full btn-primary py-3 font-medium">Log In / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
