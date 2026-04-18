import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

const FloatingCart = () => {
  const { getTotalItems, getTotalPrice } = useCartStore();
  const location = useLocation();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Hide on certain pages (e.g., checkout, cart)
  if (
    totalItems === 0 || 
    location.pathname === '/cart' || 
    location.pathname === '/checkout' || 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/invoice')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-40 animate-slide-up">
      <Link 
        to="/cart" 
        className="bg-primary-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 border border-primary-500/50"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide">
              {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
            </span>
            <span className="text-xs text-primary-100 font-medium">
              ₹{totalPrice.toFixed(2)} plus taxes
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
          View Cart <ArrowRight size={18} className="animate-pulse" />
        </div>
      </Link>
    </div>
  );
};

export default FloatingCart;
