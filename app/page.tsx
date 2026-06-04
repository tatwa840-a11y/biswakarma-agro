'use client'
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: 50}}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#16a34a', padding: '15px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Biswakarma Agro 🌾</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 20 }}>ସ୍ୱାଗତ, {user?.email}</h2>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#16a34a', margin: '0 0 10px 0' }}>Total Products</h3>
            <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>0</p>
          </div>
          <div style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2563eb', margin: '0 0 10px 0' }}>Total Orders</h3>
            <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>0</p>
          </div>
          <div style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>Revenue</h3>
            <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>₹0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 30 }}>
          <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/add-product')} style={{ padding: '12px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              + Add Product
            </button>
            <button style={{ padding: '12px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              View Orders
            </button>
            <button style={{ padding: '12px 20px', background: '#ca8a04', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Customers
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
          <p style={{ color: '#6b7280' }}>ଏଠି ତୋର Orders, New Customers ଦେଖାଯିବ।</p>
        </div>
      </div>
    </div>
  );
}