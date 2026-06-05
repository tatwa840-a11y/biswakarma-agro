'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

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
      <h1 style={{ fontSize: 48, color: '#16a34a', marginBottom: 10 }}>
        Biswakarma Agro 🌾
      </h1> 
      <p style={{ fontSize: 20, marginBottom: 30, color: '#666' }}>
        Welcome to Our Online Store
      </p>
      
      <div>
        <button 
          onClick={() => router.push('/login')}
          style={{ 
            padding: '12px 30px', 
            fontSize: 18, 
            background: '#16a34a', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer',
            margin: 10
          }}
        >
          Admin Login
        </button>
        
        <button 
          onClick={() => router.push('/products')}
          style={{ 
            padding: '12px 30px', 
            fontSize: 18, 
            background: '#fff', 
            color: '#16a34a', 
            border: '2px solid #16a34a', 
            borderRadius: 8, 
            cursor: 'pointer',
            margin: 10
          }}
        >
          Shop Now
        </button>
      </div>
    </div> 
  )
}