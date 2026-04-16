import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/useCartStore';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setItem(data);
      } catch (err: any) {
        console.error("Error fetching item details:", err);
        setError("Could not find this item. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!item || !item.is_available) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: qty,
      image_url: item.image_url
    });
    
    // Provide some visual feedback (maybe a toast in the future)
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse mt-8 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
        <div className="w-full md:w-1/2 space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-text-muted hover:text-primary-600 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Image Section */}
        <div className="w-full md:w-1/2 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] w-full">
            <img 
              src={item.image_url || 'https://via.placeholder.com/800x600?text=Food+Image'} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {!item.is_available && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
              <div className="px-6 py-4 bg-red-500 text-white font-bold text-xl rounded-xl shadow-xl transform rotate-[-5deg]">
                SOLD OUT
              </div>
            </div>
          )}
          {item.category === 'special' && (
            <div className="absolute top-6 right-6 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-lg text-sm uppercase tracking-wide">
              Special Menu
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full">
          {item.category === 'special' && (
            <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-2">Premium Selection</p>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-h mb-4 leading-tight">
            {item.name}
          </h1>
          
          <div className="text-3xl font-bold text-primary-600 mb-8">
            ₹{item.price.toFixed(2)}
          </div>
          
          <p className="text-lg text-text-muted mb-10 leading-relaxed border-l-4 border-primary-200 pl-6 py-2">
            {item.description || "A delicious culinary creation carefully prepared by our expert chefs."}
          </p>

          <div className="flex flex-col gap-6 p-6 glass-card border border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-main">Quantity</span>
              <div className="flex items-center gap-4 bg-surface dark:bg-gray-900 rounded-xl p-1 border border-[var(--border-color)]">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  disabled={!item.is_available}
                >
                  -
                </button>
                <span className="w-8 text-center font-bold font-mono text-lg">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  disabled={!item.is_available}
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-text-muted">
                Total: <span className="text-2xl font-bold text-text-h ml-2">₹{(item.price * qty).toFixed(2)}</span>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={!item.is_available}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  item.is_available 
                  ? 'bg-primary-600 text-white shadow-xl hover:shadow-primary-500/50 hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                }`}
              >
                <ShoppingCart size={24} />
                {item.is_available ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
