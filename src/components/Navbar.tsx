import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, User, UtensilsCrossed, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
  const { session, role, signOut } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-heading font-bold text-2xl tracking-tight transition-transform hover:scale-105 active:scale-95">
            <UtensilsCrossed size={28} />
            <span>Tasty Kitchen</span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link to="/" className="text-text-main font-medium hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/menu" className="text-text-main font-medium hover:text-primary-600 transition-colors">Menu</Link>
            <Link to="/special" className="text-text-main font-medium hover:text-primary-600 transition-colors">Specials</Link>
            <Link to="/reviews" className="text-text-main font-medium hover:text-primary-600 transition-colors">Reviews</Link>
          </div>

          <div className="flex items-center gap-4">
            {role === 'admin' && (
              <Link to="/admin" className="hidden sm:flex text-text-muted hover:text-primary-600 transition-colors" title="Admin Dashboard">
                <Settings size={20} />
              </Link>
            )}

            <Link to="/cart" className="relative p-2 text-text-main hover:text-primary-600 transition-colors">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full shadow-sm">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
                <Link to="/account" className="p-2 text-text-main hover:text-primary-600 transition-colors" title="Account">
                  <User size={20} />
                </Link>
                <button onClick={handleSignOut} className="p-2 text-text-muted hover:text-red-500 transition-colors" title="Sign Out">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="pl-2 border-l border-[var(--border-color)]">
                <Link to="/login" className="btn-primary text-sm shadow-sm py-1.5 px-4 font-medium">Log In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
