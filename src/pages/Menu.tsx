import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ItemCard from '../components/ItemCard';
import { UtensilsCrossed } from 'lucide-react';

const Menu = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('category', 'regular')
          .order('name');
          
        if (error) throw error;
        if (data) setItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-h mb-4">Our Menu</h1>
        <p className="text-text-muted max-w-2xl mx-auto">Explore our wide variety of delicious dishes made from scratch every day.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse bg-surface dark:bg-gray-800 h-80 rounded-2xl border border-[var(--border-color)]"></div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 glass rounded-2xl max-w-2xl mx-auto">
          <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Menu Updating</h2>
          <p className="text-text-muted">We are currently updating our regular menu. Please check out our Specials or come back soon.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
