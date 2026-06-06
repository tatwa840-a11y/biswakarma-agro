"use client"
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FiUser, FiPhone, FiMapPin, FiShoppingBag } from 'react-icons/fi';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => doc.data());

      // Group orders by phone number to get unique customers
      const customerMap = {};
      ordersData.forEach(order => {
        const phone = order.phone;
        if (!customerMap[phone]) {
          customerMap[phone] = {
            name: order.customerName,
            phone: order.phone,
            address: order.address,
            pincode: order.pincode,
            city: order.city,
            state: order.state,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null
          };
        }
        customerMap[phone].totalOrders += 1;
        customerMap[phone].totalSpent += order.totalAmount || 0;

        const orderDate = order.createdAt?.toDate();
        if (!customerMap[phone].lastOrderDate || orderDate > customerMap[phone].lastOrderDate) {
          customerMap[phone].lastOrderDate = orderDate;
        }
      });

      const customersList = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(customersList);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ fontSize: 18, color: '#64748b' }}>Loading customers...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#16a34a', margin: 0 }}>Customers</h1>
          <div style={{ background: 'white', padding: '12px 20px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 14, color: '#64748b' }}>Total Customers: </span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#16a34a' }}>{customers.length}</span>
          </div>
        </div>

        {customers.length === 0? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 12 }}>
            <FiUser size={64} color="#cbd5e1" />
            <p style={{ fontSize: 18, color: '#64748b', marginTop: 16 }}>No customers yet</p>
            <p style={{ fontSize: 14, color: '#94a3b8' }}>Customers will appear here after first order</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
            {customers.map((customer, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiUser size={24} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{customer.name}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiPhone size={14} /> {customer.phone}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', display: 'flex', alignItems: 'start', gap: 6 }}>
                    <FiMapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</span>
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>Total Orders</p>
                    <p style={{ fontSize: 20, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiShoppingBag size={18} color="#16a34a" /> {customer.totalOrders}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>Total Spent</p>
                    <p style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#16a34a' }}>₹{customer.totalSpent}</p>
                  </div>
                </div>

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                    Last Order: {customer.lastOrderDate?.toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}