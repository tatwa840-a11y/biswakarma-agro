"use client"
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { FiPackage, FiPhone, FiMapPin, FiCheck, FiX } from 'react-icons/fi';

export default function SalesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, status: newStatus} : order
      ));
      alert(`Order ${newStatus} successfully!`);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#f59e0b';
      case 'Confirmed': return '#3b82f6';
      case 'Delivered': return '#16a34a';
      case 'Cancelled': return '#dc2626';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ fontSize: 18, color: '#64748b' }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#16a34a', marginBottom: 32 }}>Sales / Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 12 }}>
            <FiPackage size={64} color="#cbd5e1" />
            <p style={{ fontSize: 18, color: '#64748b', marginTop: 16 }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Order #{order.id.slice(-6)}</h3>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: 12, 
                        fontSize: 12, 
                        fontWeight: 600, 
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status)
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                      {order.createdAt?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 24, fontWeight: 700, color: '#16a34a', margin: 0 }}>₹{order.totalAmount}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>{order.paymentMethod}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#64748b' }}>Customer Details</p>
                    <p style={{ fontSize: 16, fontWeight: 600, margin: '4px 0' }}>{order.customerName}</p>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiPhone size={14} /> {order.phone}
                    </p>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0', display: 'flex', alignItems: 'start', gap: 6 }}>
                      <FiMapPin size={14} style={{ marginTop: 2 }} /> 
                      {order.address}, {order.city}, {order.state} - {order.pincode}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#64748b' }}>Order Items</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: 14, margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.productName} x {item.qty}</span>
                        <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={() => updateStatus(order.id, 'Confirmed')}
                      style={{ flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <FiCheck /> Confirm Order
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'Cancelled')}
                      style={{ flex: 1, padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <FiX /> Cancel Order
                    </button>
                  </div>
                )}

                {order.status === 'Confirmed' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Delivered')}
                    style={{ width: '100%', padding: '10px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <FiCheck /> Mark as Delivered
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}