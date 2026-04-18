import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, Printer, Download, ArrowLeft } from 'lucide-react';

const Invoice = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, user:users(display_name, email)')
          .eq('id', orderId)
          .single();
          
        if (error) throw error;
        setOrder(data);
      } catch (err: any) {
        console.error("Fetch invoice error:", err);
        setError("Could not retrieve this invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <Link to="/account" className="btn-secondary">Go to Account</Link>
      </div>
    );
  }

  // Calculate generic parts if items exist
  const date = new Date(order.created_at).toLocaleString();
  const tax = Number(order.total_price) * 0.05; // Re-calculating rough tax
  const subtotal = Number(order.total_price) - tax;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      <div className="mb-6 flex flex-wrap justify-between items-center gap-3 print:hidden">
        <button onClick={() => navigate('/account')} className="flex items-center gap-2 text-text-muted hover:text-primary-600 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Account
        </button>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm shadow-sm">
            <Printer size={16} /> Print
          </button>
          <button className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm shadow-sm" onClick={() => alert('PDF Download coming soon!')}>
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden print:shadow-none print:bg-transparent">
        
        {/* Invoice Header */}
        <div className="bg-primary-600 text-white p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-300 shrink-0" size={28} />
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">Order Confirmed!</h1>
              </div>
              <p className="text-primary-100 italic text-sm sm:text-base">Thank you for dining with Rumela's Kitchen.</p>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-100 uppercase tracking-widest font-bold mb-1">Invoice Number</p>
              <p className="font-mono font-medium text-base sm:text-lg">#{order.id.split('-')[0].toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-4 sm:p-8">
          {/* Billed To / Order Details */}
          <div className="flex flex-col sm:flex-row justify-between border-b border-[var(--border-color)] pb-6 mb-6 gap-6">
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 border-l-2 border-primary-500 pl-2">Billed To</h3>
              <p className="font-bold text-base sm:text-lg text-text-h">{order.user?.display_name || 'Customer'}</p>
              <p className="text-text-muted text-sm">{order.user?.email || 'Email unavailable'}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 border-l-2 border-primary-500 pl-2">Order Details</h3>
              <p className="text-sm"><span className="text-text-muted mr-2">Date:</span><span className="font-medium text-text-main">{date}</span></p>
              <p className="text-sm mt-1"><span className="text-text-muted mr-2">Status:</span>
                <span className={`inline-block ml-1 px-2 py-0.5 rounded text-xs font-bold uppercase
                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : ''}
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                `}>
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table — scrollable on mobile */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 mb-6">
            <table className="w-full min-w-[480px] text-left border-collapse px-4 sm:px-0">
              <thead>
                <tr className="border-b-2 border-[var(--border-color)] text-text-muted text-xs uppercase tracking-wider">
                  <th className="py-3 font-bold pl-4 sm:pl-0">Item</th>
                  <th className="py-3 text-center font-bold">Qty</th>
                  <th className="py-3 text-right font-bold">Price</th>
                  <th className="py-3 text-right font-bold pr-4 sm:pr-0">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id} className="border-b border-[var(--border-color)] text-text-main hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 font-medium text-sm pl-4 sm:pl-0">{item.name}</td>
                    <td className="py-3 text-center font-mono text-sm">{item.qty}</td>
                    <td className="py-3 text-right text-sm">₹{Number(item.price).toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-sm pr-4 sm:pr-0">₹{(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col sm:flex-row justify-between border-t-2 border-[var(--border-color)] pt-6 gap-6">
            <div className="text-sm text-text-muted max-w-xs hidden sm:block">
              <strong className="block text-text-main mb-2 tracking-wide uppercase">Payment Terms</strong>
              Payment is processed securely. Please keep this invoice for your records. For inquiries, email hello@rumelaskitchen.com.
            </div>
            
            <div className="w-full sm:w-auto sm:min-w-[260px] space-y-3 p-5 bg-surface dark:bg-gray-900 rounded-2xl border border-[var(--border-color)]">
              <div className="flex justify-between text-text-muted text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted text-sm">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-[var(--border-color)] text-lg font-bold">
                <span className="text-text-main">Grand Total</span>
                <span className="text-primary-600">₹{Number(order.total_price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Invoice;
