"use client"
import { useCart } from '../context/CartContext'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const router = useRouter();
  
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.sellingPrice) || 0;
    const quantity = Number(item.qty) || 0;
    return sum + (price * quantity);
  }, 0);

  const handleCheckout = () => {
    const customer = localStorage.getItem('customer');
    if (!customer) {
      router.push('/customer-login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#16a34a', margin: 0 }}>Your Cart</h1>
        </div>
      </div>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        {cartItems.length === 0? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <p style={{ fontSize: 18, color: '#64748b', marginBottom: 16 }}>Your cart is empty</p>
            <button 
              onClick={() => router.push('/products')} 
              style={{ 
                padding: '12px 24px', 
                background: '#16a34a', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8, 
                cursor: 'pointer', 
                fontSize: 16, 
                fontWeight: 600 
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div>
              {cartItems.map(item => (
                <div key={item.id} style={{ 
                  background: 'white', 
                  borderRadius: 12, 
                  padding: 16, 
                  marginBottom: 16, 
                  display: 'flex', 
                  gap: 16, 
                  border: '1px solid #e2e8f0' 
                }}>
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/100'} 
                    alt={item.productName} 
                    style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 8 }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{item.productName}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0' }}>{item.brand}</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#16a34a', margin: '8px 0' }}>₹{Number(item.sellingPrice)}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      style={{ 
                        padding: 8, 
                        background: '#fee2e2', 
                        color: '#dc2626', 
                        border: 'none', 
                        borderRadius: 6, 
                        cursor: 'pointer' 
                      }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      border: '2px solid #e2e8f0', 
                      borderRadius: 8, 
                      padding: '4px 8px' 
                    }}>
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: 12, 
              padding: 24, 
              height: 'fit-content', 
              border: '1px solid #e2e8f0', 
              position: 'sticky', 
              top: 100 
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Order Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748b' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748b' }}>Delivery</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>Free</span>
              </div>
              <div style={{ 
                borderTop: '2px solid #e2e8f0', 
                margin: '16px 0', 
                paddingTop: 16, 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>₹{total}</span>
              </div>
              <button 
                onClick={handleCheckout}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  background: '#16a34a', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 8, 
                  cursor: 'pointer', 
                  fontSize: 16, 
                  fontWeight: 700, 
                  marginTop: 16 
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}