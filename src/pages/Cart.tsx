import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-sm border border-[var(--border-color)]">
          <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <h2 className="text-3xl font-bold font-heading mb-4 text-text-h">Your cart is empty</h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">Looks like you haven't added any delicious items to your cart yet.</p>
          <button onClick={() => navigate('/menu')} className="btn-primary inline-flex items-center gap-2">
            Browse Menu <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-text-h">Your Cart</h1>
        <button 
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-800 hover:-translate-y-0">
              <img 
                src={item.image_url || 'https://via.placeholder.com/150'} 
                alt={item.name} 
                className="w-full sm:w-24 h-24 object-cover rounded-xl shrink-0"
              />
              <div className="flex-grow text-center sm:text-left w-full sm:w-auto">
                <Link to={`/item/${item.id}`} className="font-bold text-lg text-text-h hover:text-primary-600 transition-colors">
                  {item.name}
                </Link>
                <div className="font-bold text-primary-600">${item.price.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-3 bg-surface dark:bg-gray-900 rounded-lg p-1 border border-[var(--border-color)]">
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-bold">{item.qty}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <div className="font-bold w-20 text-right text-text-h">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <Link to="/menu" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline mt-4">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-6 bg-surface dark:bg-gray-800 sticky top-24 border-t-4 border-primary-500">
            <h2 className="text-xl font-bold font-heading mb-6 border-b border-[var(--border-color)] pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span className="font-medium text-text-main">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Taxes & Fees</span>
                <span className="font-medium text-text-main">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-6 mb-8 text-xl font-bold">
              <span>Estimated Total</span>
              <span className="text-primary-600">${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-4 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
