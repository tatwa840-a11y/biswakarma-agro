"use client"
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const { cartItems, setCartItems } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.sellingPrice) || 0;
    const quantity = Number(item.qty) || 0;
    return sum + (price * quantity);
  }, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      router.push('/products');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      alert('Please enter valid 10 digit phone number');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        items: cartItems.map(item => ({
          id: item.id,
          productName: item.productName,
          brand: item.brand,
          price: Number(item.sellingPrice),
          qty: Number(item.qty),
          imageUrl: item.imageUrl
        })),
        totalAmount: total,
        status: 'Pending',
        paymentMethod: 'Cash on Delivery',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setCartItems([]); // Cart ଖାଲି କର
      alert('Order Placed Successfully! 🎉\nWe will contact you soon.');
      router.push('/products');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#64748b', marginBottom: 16 }}>Your cart is empty</p>
          <button onClick={() => router.push('/products')} style={{ padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#16a34a', marginBottom: 32 }}>Checkout</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          {/* Delivery Form */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Delivery Address</h2>
            <form onSubmit={handlePlaceOrder}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 16, outline: 'none' }}
                  placeholder="Enter your name" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength={10}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 16, outline: 'none' }}
                  placeholder="10 digit mobile number" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Address *</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows={3}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 16, outline: 'none', resize: 'none' }}
                  placeholder="House No, Street, Area" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Pincode *</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required maxLength={6}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 16, outline: 'none' }}
                    placeholder="6 digit pincode" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 16, outline: 'none' }}
                    placeholder="City" />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 16, outline: 'none' }}
                  placeholder="State" />
              </div>

              <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#166534', margin: 0 }}>💵 Cash on Delivery Available</p>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '16px', background: loading ? '#94a3b8' : '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 18, fontWeight: 700 }}>
                {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 12, padding: 24, height: 'fit-content', border: '1px solid #e2e8f0', position: 'sticky', top: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Order Summary</h2>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{item.productName}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Qty: {item.qty}</p>
                </div>
                <p style={{ fontWeight: 600 }}>₹{Number(item.sellingPrice) * Number(item.qty)}</p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid #e2e8f0' }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}