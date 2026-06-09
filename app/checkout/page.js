'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FiUser, FiLogOut } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      const fixedCart = parsedCart.map(item => ({
       ...item,
        price: Number(item.price) || Number(item.rate) || Number(item.amount) || Number(item.sellingPrice) || 0,
        qty: Number(item.qty) || Number(item.quantity) || 1
      }));
      setCart(fixedCart);
    } else {
      router.push('/products');
    }

    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const data = JSON.parse(customerData);
      setCustomer(data);
      setName(data.name);
      setPhone(data.mobile);
    }
  }, [router]);

  const handleCustomerLogout = () => {
    localStorage.removeItem('customer');
    setCustomer(null);
    setName('');
    setPhone('');
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + (price * qty);
  }, 0);

  const handlePlaceOrder = async () => {
    if (!name.trim() ||!phone.trim() ||!address.trim()) {
      alert('ସବୁ Details ଭରନ୍ତୁ');
      return;
    }
    if (totalAmount === 0) {
      alert('Cart ରେ Price 0 ଅଛି। Product ପୁଣି Add କରନ୍ତୁ');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: cart,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        status: paymentMethod === 'COD'? 'Pending' : 'Payment Pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      localStorage.removeItem('cart');
      router.push(`/order-success?id=${docRef.id}`);
    } catch (error) {
      alert('Error: ' + error.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cart Empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>

            {customer? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-green-700">{customer.name}</p>
                      <p className="text-sm text-green-600">+91 {customer.mobile}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCustomerLogout}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700 mb-3">Already have an account?</p>
                <button
                  onClick={() => router.push('/customer-login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                  Customer Login
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={customer}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-slate-100"
                  placeholder="ନାମ ଲେଖନ୍ତୁ"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={customer}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-slate-100"
                  placeholder="10 Digit Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Full Address *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="3"
                  placeholder="ଗାଁ, ପୋଷ୍ଟ, ଜିଲ୍ଲା, ପିନ୍ କୋଡ"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Payment Method *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Online Payment</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.productName || item.name} x {item.qty}</span>
                  <span className="font-semibold">₹{(Number(item.price) || 0) * (Number(item.qty) || 0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-green-600">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || totalAmount === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {loading? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}