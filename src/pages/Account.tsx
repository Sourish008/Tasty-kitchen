import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';
import { FileText, Clock, User, CheckCircle, MapPin } from 'lucide-react';

const Account = () => {
  const { session, user, signOut } = useAuthStore();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-8 text-center bg-white dark:bg-gray-800 border border-[var(--border-color)]">
            <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={40} />
            </div>
            
            <h2 className="text-2xl font-bold font-heading mb-2 text-text-h">
              {user?.user_metadata?.full_name || 'Valued Customer'}
            </h2>
            <p className="text-text-muted mb-6">{user?.email}</p>
            
            <div className="border-t border-[var(--border-color)] pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Member Since</span>
                <span className="font-medium">{new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Total Orders</span>
                <span className="font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{orders.length}</span>
              </div>
            </div>

            <button 
              onClick={handleSignOut}
              className="mt-8 w-full btn-secondary text-red-500 border-red-500 hover:bg-red-50"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2 text-text-h">
            <Clock className="text-primary-600" /> Order History
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-surface dark:bg-gray-800 h-24 rounded-2xl border border-[var(--border-color)]"></div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="glass-card p-6 bg-white dark:bg-gray-800 hover:-translate-y-1 transition-transform border border-[var(--border-color)]">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-[var(--border-color)] pb-4">
                    <div>
                      <div className="text-sm text-text-muted mb-1">
                        Order <span className="font-mono text-text-main font-medium">#{order.id.split('-')[0]}</span>
                      </div>
                      <div className="font-bold text-text-main">
                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-flex items-center gap-1
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : ''}
                        ${order.status === 'preparing' ? 'bg-blue-100 text-blue-700 border border-blue-200' : ''}
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700 border border-green-200' : ''}
                      `}>
                        {order.status === 'delivered' && <CheckCircle size={12} />}
                        {order.status}
                      </span>
                      <span className="font-bold text-lg text-primary-600">₹{Number(order.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-text-muted text-sm line-clamp-1">
                      {order.items.map((item: any) => `${item.qty}x ${item.name}`).join(', ')}
                    </p>
                    
                    <Link 
                      to={`/invoice/${order.id}`}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 border border-primary-200 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors text-sm font-medium"
                    >
                      <FileText size={16} /> View Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-2xl border border-[var(--border-color)]">
              <MapPin size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg text-text-muted mb-4">No past orders found.</p>
              <Link to="/menu" className="btn-primary inline-block">Order Now</Link>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Account;
