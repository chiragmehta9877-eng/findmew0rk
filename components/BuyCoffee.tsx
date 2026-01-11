'use client';

import { useState } from 'react';
import { Coffee, Minus, Plus, Loader2, Heart } from 'lucide-react';

export default function BuyCoffee() {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const PRICE_PER_COFFEE = 150; // ₹150 (Approx $2)

  // 1. Script Load karne ka function
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    // 2. Script load karo
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 3. Backend se Order ID mangvao
      const apiRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: count }),
      });
      
      const data = await apiRes.json();

      // 4. Razorpay Options setup karo
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "FindMeWork Support",
        description: `Thank you for buying ${count} coffees!`,
        order_id: data.orderId,
        handler: function (response: any) {
          // Payment Success hone par yahan aayega
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          // Yahan aap redirect kar sakte ho ya confetti dikha sakte ho
          window.location.href = "/dashboard?payment=success";
        },
        prefill: {
          name: "User Name", // Aap session se user ka naam bhi daal sakte ho
          email: "user@example.com",
        },
        theme: {
          color: "#0D9488", // Teal Color (Aapki theme match karega)
        },
      };

      // 5. Popup kholo
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg max-w-sm w-full mx-auto text-center">
      
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
            <Coffee size={24} className="fill-current" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buy me a Coffee</h3>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Support via UPI/Cards (₹{PRICE_PER_COFFEE}/coffee)
      </p>

      {/* Counter */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-black/20 p-3 rounded-xl mb-6 border border-gray-100 dark:border-white/5">
        <button 
            onClick={() => setCount(prev => Math.max(1, prev - 1))}
            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors text-slate-600 dark:text-white"
        >
            <Minus size={18} />
        </button>
        
        <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{count}</span>
        </div>

        <button 
            onClick={() => setCount(prev => prev + 1)}
            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors text-slate-600 dark:text-white"
        >
            <Plus size={18} />
        </button>
      </div>

      {/* Pay Button */}
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {loading ? (
            <Loader2 size={20} className="animate-spin" />
        ) : (
            <>
                Support ₹{count * PRICE_PER_COFFEE} <Heart size={18} className="fill-white/30 text-white" />
            </>
        )}
      </button>
      
      <p className="text-[10px] text-slate-400 mt-3">Secured by Razorpay (UPI Supported)</p>
    </div>
  );
}