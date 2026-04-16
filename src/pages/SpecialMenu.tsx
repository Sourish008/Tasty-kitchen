import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ItemCard from '../components/ItemCard';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

const SpecialMenu = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('category', 'special')
          .order('name');
          
        if (error) throw error;
        if (data) setItems(data);
      } catch (error) {
        console.error("Error fetching special menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="bg-surface dark:bg-surface-dark min-h-screen pb-12">
      <div className="bg-gradient-to-b from-primary-50 to-surface dark:from-gray-900 dark:to-surface-dark pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-600 rounded-full mb-6">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-text-h mb-6">Today's Specials</h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Our chef's premium selection of exclusive dishes. 
            Available for a limited time and prepared with the utmost care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-96 rounded-2xl"></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 glass rounded-2xl max-w-2xl mx-auto">
            <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Specials Currently</h2>
            <p className="text-text-muted">The chef is preparing a new set of specials. Please check the regular menu in the meantime.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialMenu;
