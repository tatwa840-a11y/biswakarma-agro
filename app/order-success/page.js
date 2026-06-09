"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const id = searchParams.get('orderId');
    if (id) {
      setOrderId(id);
    } else {
      router.push('/products');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl text-center max-w-md w-full border border-slate-200 shadow-lg">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed! 🎉</h1>
        <p className="text-slate-600 mb-2">Your order has been placed successfully</p>
        
        {orderId && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6 mt-4">
            <p className="text-sm text-slate-500 mb-1">Order ID</p>
            <p className="text-2xl font-bold text-slate-800">#{orderId}</p>
          </div>
        )}

        <p className="text-sm text-slate-600 mb-6">
          We have sent order details to your WhatsApp. 
          <br/>Our team will contact you soon for delivery.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => router.push('/products')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">Need help? Call us</p>
          <a href="tel:9692333566" className="text-green-600 font-bold text-lg">9692333566</a>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}