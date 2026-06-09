"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FiLogOut, FiPackage, FiUser, FiMapPin, FiHome, FiShoppingBag, FiPhone } from 'react-icons/fi';

export default function CustomerDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/customer-login');
      return;
    }
    const data = JSON.parse(customerData);
    setCustomer(data);
    fetchOrders(data.mobile);
  }, [router]);

  const fetchOrders = async (phone) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('phone', '==', phone),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    router.push('/');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Payment Pending': return 'bg-orange-100 text-orange-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 rounded-lg" >
              <FiHome size={20} />
            </button>
            <h1 className="text-2xl font-bold text-green-600">My Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100" >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiShoppingBag className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPackage className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Active Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status!== 'Delivered' && o.status!== 'Cancelled').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiUser className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Spent</p>
                <p className="text-2xl font-bold">
                  ₹{orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button onClick={() => setActiveTab('orders')} className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
              activeTab === 'orders'? 'bg-green-50 text-green-600 border-b-2 border-green-600' : 'text-slate-600 hover:bg-slate-50'
            }`} >
              <FiPackage /> My Orders
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
              activeTab === 'profile'? 'bg-green-50 text-green-600 border-b-2 border-green-600' : 'text-slate-600 hover:bg-slate-50'
            }`} >
              <FiUser /> Profile
            </button>
          </div>

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {orders.length === 0? (
                  <div className="text-center py-12">
                    <FiPackage className="mx-auto text-slate-300 mb-4" size={64} />
                    <p className="text-slate-500 mb-4">No orders yet</p>
                    <button onClick={() => router.push('/products')} className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700" >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold text-lg">#{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-slate-500">
                              {order.createdAt?.toDate().toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4 bg-slate-50 rounded-lg p-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-slate-700">
                                {item.productName || item.name} x {item.qty}
                              </span>
                              <span className="font-semibold">
                                ₹{(Number(item.price) || 0) * (Number(item.qty) || 0)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                          <div className="text-sm">
                            <span className="text-slate-500">Payment: </span>
                            <span className="font-semibold">{order.paymentMethod}</span>
                          </div>
                          <span className="text-xl font-bold text-green-600">
                            ₹{order.totalAmount}
                          </span>
                        </div>

                        {order.address && (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex items-start gap-2 text-sm text-slate-600">
                            <FiMapPin className="mt-0.5" size={16} />
                            <span>{order.address}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-green-600" size={40} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{customer.name}</h2>
                      <p className="text-slate-600">Customer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                      <FiUser className="text-slate-400" size={20} />
                      <div>
                        <p className="text-sm text-slate-500">Full Name</p>
                        <p className="font-semibold">{customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                      <FiPhone className="text-slate-400" size={20} />
                      <div>
                        <p className="text-sm text-slate-500">Phone Number</p>
                        <p className="font-semibold">+91 {customer.mobile}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={() => router.push('/products')} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2" >
                  <FiShoppingBag /> Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}