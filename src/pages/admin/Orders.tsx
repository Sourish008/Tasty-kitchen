import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, user:users(display_name, email)')
      .order('created_at', { ascending: false });
      
    if (!error && data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, currentStatus: string, newStatus: string) => {
    if (currentStatus === newStatus) return;
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-h mb-6">Manage Orders</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-[var(--border-color)]">
                <th className="p-4 font-bold text-text-muted">Order ID & Date</th>
                <th className="p-4 font-bold text-text-muted">Customer</th>
                <th className="p-4 font-bold text-text-muted">Items</th>
                <th className="p-4 font-bold text-text-muted">Total</th>
                <th className="p-4 font-bold text-text-muted text-center">Status</th>
                <th className="p-4 font-bold text-text-muted text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center"><div className="animate-pulse w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent mx-auto animate-spin"></div></td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <p className="font-mono text-xs mb-1">#{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-sm font-medium">{new Date(order.created_at).toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold">{order.user?.display_name || 'Customer'}</p>
                    <p className="text-xs text-text-muted">{order.user?.email || 'N/A'}</p>
                  </td>
                  <td className="p-4 text-sm max-w-[200px]">
                    <div className="truncate text-text-muted" title={order.items.map((i:any) => `${i.qty}x ${i.name}`).join(', ')}>
                      {order.items.map((i:any) => `${i.qty}x ${i.name}`).join(', ')}
                    </div>
                    <span className="text-xs font-bold text-primary-600 mt-1 inline-block">({order.items.reduce((acc:any, i:any)=>acc+i.qty, 0)} items)</span>
                  </td>
                  <td className="p-4 font-bold text-primary-600">₹{Number(order.total_price).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, order.status, e.target.value)}
                      className={`text-sm font-bold uppercase rounded px-2 py-1 outline-none appearance-none border cursor-pointer
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
                        ${order.status === 'preparing' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                      `}
                    >
                      <option value="pending">PENDING</option>
                      <option value="preparing">PREPARING</option>
                      <option value="delivered">DELIVERED</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <Link to={`/invoice/${order.id}`} className="inline-flex items-center justify-center p-2 text-text-muted hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <ExternalLink size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr><td colSpan={6} className="p-8 text-center text-text-muted">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
