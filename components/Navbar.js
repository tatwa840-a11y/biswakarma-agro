"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiLogIn, FiLogOut, FiShoppingCart, FiHome, FiShield } from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkCustomer = () => {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        setCustomer(JSON.parse(customerData));
      } else {
        setCustomer(null);
      }
    };

    const updateCart = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        const count = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    checkCustomer();
    updateCart();

    window.addEventListener('storage', () => {
      checkCustomer();
      updateCart();
    });

    return () => window.removeEventListener('storage', checkCustomer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customer');
    setCustomer(null);
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-green-600 cursor-pointer flex items-center gap-2"
          >
            <FiHome />
            Biswakarma Agro
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Products Button */}
            <button
              onClick={() => router.push('/products')}
              className="hidden md:block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Products
            </button>

            {/* Cart Button */}
            <button
              onClick={() => router.push('/cart')}
              className="relative px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
            >
              <FiShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Login / Profile */}
            {customer? (
              <>
                <button
                  onClick={() => router.push('/customer')}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100"
                >
                  <FiUser size={18} />
                  <span className="hidden sm:inline max-w-[100px] truncate">{customer.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </>
            ) : (
              <>
                {/* Customer Login */}
                <button
                  onClick={() => router.push('/customer-login')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
                >
                  <FiLogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </button>

                {/* Admin Login */}
                <button
                  onClick={() => router.push('/admin-login')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100"
                  title="Admin Login"
                >
                  <FiShield size={18} />
                  <span className="hidden md:inline">Admin</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}