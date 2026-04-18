import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { CreditCard, Truck, Check } from 'lucide-react';
import { toast } from '../stores/useToastStore';

const Checkout = () => {
  const { session } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dummy form state
  const [address, setAddress] = useState('');
  
  const totalprice = getTotalPrice();
  const tax = totalprice * 0.05; // 5% tax
  const subtotal = totalprice;
  const grandTotal = totalprice + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setLoading(true);
    setError(null);

    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your connection.');
      }

      // Call edge function to create order
      const { data: functionData, error: functionError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: grandTotal }
      });

      if (functionError) throw new Error(functionError.message);
      if (functionData?.error) throw new Error(functionData.error);
      
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
         throw new Error("Razorpay Key ID is not configured.");
      }

      // Create order payload strictly matching the JSONB schema
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty
      }));

      const options = {
        key: razorpayKeyId,
        amount: functionData.amount, // from razorpay edge function (in paise)
        currency: "INR",
        name: "Rumela's Kitchen",
        description: "Food Order Payment",
        order_id: functionData.id, // from razorpay edge function
        handler: async function (response: any) {
          try {
            const { data, error } = await supabase
              .from('orders')
              .insert({
                user_id: session.user.id,
                items: orderItems,
                total_price: grandTotal,
                status: 'pending'
              })
              .select()
              .single();

            if (error) throw error;

            toast.success('Order placed! 🎉', `Your order of ₹${grandTotal.toFixed(2)} is confirmed and being prepared.`, 5000);
            clearCart();
            navigate(`/invoice/${data.id}`);
          } catch (err: any) {
            console.error('Order save error:', err);
            toast.error('Order save failed', 'Payment was successful but we could not save your order. Contact support with Payment ID: ' + response.razorpay_payment_id, 8000);
          }
        },
        prefill: {
          name: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0],
          email: session?.user?.email,
          contact: "" 
        },
        theme: {
          color: "#ea580c" // primary-600
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        const desc = response?.error?.description || 'Unknown error';
        toast.error('Payment failed', desc, 6000);
        setError(`Payment Failed: ${desc}`);
        setLoading(false);
      });
      
      rzp.open();

    } catch (err: any) {
      console.error('Order error:', err);
      toast.error('Could not initiate payment', err.message || 'Please try again.');
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="btn-primary inline-block">Return to Menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-heading text-text-h mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-3/5">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            
            <div className="glass-card p-6 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4 border-[var(--border-color)]">
                <Truck className="text-primary-600" /> Delivery Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-main">Full Name</label>
                  <input type="text" className="input-field bg-gray-50 dark:bg-gray-900" 
                    defaultValue={session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0]} 
                    required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-main">Delivery Address</label>
                  <textarea 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3} 
                    className="input-field bg-gray-50 dark:bg-gray-900" 
                    placeholder="Enter your full delivery address..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4 border-[var(--border-color)]">
                <CreditCard className="text-primary-600" /> Payment
              </h2>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800 mb-4">
                <p className="font-semibold mb-1">Razorpay Secure Checkout</p>
                <p className="text-sm">You will be redirected to Razorpay's secure payment gateway to complete your purchase using UPI, Card, Netbanking, or Wallet.</p>
              </div>
            </div>

          </form>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="glass-card p-6 bg-surface dark:bg-gray-800 sticky top-24">
            <h2 className="text-xl font-bold font-heading mb-6 border-b border-[var(--border-color)] pb-4 text-text-h">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-text-muted flex items-center gap-2">
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{item.qty}x</span>
                    <span className="truncate max-w-[150px]">{item.name}</span>
                  </span>
                  <span className="font-medium text-text-main">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[var(--border-color)] pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm text-text-muted">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-4 mb-8 text-xl font-bold">
              <span>Total</span>
              <span className="text-primary-600">₹{grandTotal.toFixed(2)}</span>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                <><Check size={20} /> Place Order</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
