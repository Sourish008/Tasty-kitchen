import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Users, ShoppingBag, Utensils } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItems: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Since we don't have RPCs strictly defined for stats yet, we will do basic queries
        // Note: For large production DBs, you'd want actual postgres functions.
        
        const [ordersRes, itemsRes] = await Promise.all([
          supabase.from('orders').select('total_price, status'),
          supabase.from('food_items').select('id', { count: 'exact' })
        ]);

        const orders = ordersRes.data || [];
        
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_price), 0),
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalItems: itemsRes.count || 0
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Users, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Menu Items', value: stats.totalItems, icon: Utensils, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading mb-8 text-text-h">Dashboard Overview</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-surface dark:bg-gray-800 h-32 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="glass-card p-6 bg-white dark:bg-gray-800 flex items-center justify-between border border-[var(--border-color)]">
                <div>
                  <p className="text-sm text-text-muted mb-1">{card.title}</p>
                  <h3 className="text-3xl font-bold text-text-h">{card.value}</h3>
                </div>
                <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 glass-card p-8 bg-white dark:bg-gray-800 border border-[var(--border-color)] text-center">
        <Utensils className="mx-auto text-primary-500 mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">Welcome to your Restaurant Panel</h2>
        <p className="text-text-muted max-w-md mx-auto">Use the sidebar to manage your food items, update incoming orders, and moderate customer reviews.</p>
      </div>

    </div>
  );
};

export default AdminDashboard;
