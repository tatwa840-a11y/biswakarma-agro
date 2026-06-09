'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const products = [
    { id: 1, name: 'ଧାନ ବିହନ - IR-64', price: 2200, unit: 'କୁଇଣ୍ଟାଲ', img: '/paddy1.jpg' },
    { id: 2, name: 'ଧାନ ବିହନ - MTU-1010', price: 2250, unit: 'କୁଇଣ୍ଟାଲ', img: '/paddy2.jpg' },
    { id: 3, name: 'ସାର - DAP', price: 1350, unit: 'ବ୍ୟାଗ', img: '/dap.jpg' },
    { id: 4, name: 'କୀଟନାଶକ', price: 450, unit: 'ଲିଟର', img: '/pesticide.jpg' },
  ]

  return (
    <div style={{ 
      padding: 40, 
      textAlign: 'center', 
      fontFamily: 'sans-serif', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center' 
    }}>
      {/* Header */}
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        right: 20, 
        display: 'flex', 
        gap: 10 
      }}>
        <button 
          onClick={() => router.push('/login')} 
          style={{ 
            padding: '8px 16px', 
            fontSize: 16, 
            background: '#16a34a', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer' 
          }}
        >
          Admin
        </button>
      </div>

      {/* Offer Banner */}
      <div style={{
        background: 'linear-gradient(to right, #16a34a, #22c55e)',
        color: 'white',
        padding: '12px',
        marginBottom: 20,
        borderRadius: 8
      }}>
        <p style={{ fontWeight: 'bold' }}>🎉 ମୌସୁମୀ ଅଫର: 50 କୁଇଣ୍ଟାଲ ଉପରେ 2% Extra ଛାଡ 🎉</p>
        <p style={{ fontSize: 14 }}>Valid Till: 30 June 2026</p>
      </div>

      <h1 style={{ fontSize: 48, color: '#16a34a', marginBottom: 10 }}>
        Biswakarma Agro 🌾
      </h1>
      <p style={{ fontSize: 20, marginBottom: 30, color: '#666' }}>
        Welcome to Our Online Store
      </p>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 20,
        margin: '0 auto',
        maxWidth: 1200,
        width: '100%'
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s'
          }}>
            <img 
              src={product.img} 
              alt={product.name} 
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover'
              }}
            />
            <div style={{ padding: 20 }}>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>{product.name}</h3>
              <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>
                ₹{product.price} / {product.unit}
              </p>
              <button 
                onClick={() => router.push('/products')}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shop Now Button */}
      <div style={{ marginTop: 30 }}>
        <button 
          onClick={() => router.push('/products')}
          style={{
            padding: '12px 30px',
            fontSize: 18,
            background: '#fff',
            color: '#16a34a',
            border: '2px solid #16a34a',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          View All Products
        </button>
      </div>
    </div>
  )
}