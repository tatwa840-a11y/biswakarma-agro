'use client'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => router.push('/')}
        style={{ 
          padding: '10px 20px', 
          marginBottom: 20, 
          background: '#fff', 
          border: '1px solid #16a34a',
          color: '#16a34a',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 600
        }}
      >
        ← Home କୁ ଫେର
      </button>

      <h1 style={{ color: '#16a34a' }}>🛒 ଆମର Products</h1>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>
        ଏବେ ଆମେ Online Order ନେଉନାହୁଁ। ଦୋକାନକୁ ଆସି କିଣନ୍ତୁ।
      </p>

      {/* Demo Products - ପରେ Firestore ରୁ Data ଆଣିବା */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: 20 
      }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3>UREA - ଇଫକୋ</h3>
          <p>Price: ₹266.50 / Bag</p>
          <p>Stock: Available</p>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3>DAP - ଇଫକୋ</h3>
          <p>Price: ₹1350 / Bag</p>
          <p>Stock: Available</p>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3>ଧାନ ବିହନ - MTU 7029</h3>
          <p>Price: ₹1200 / Bag</p>
          <p>Stock: Limited</p>
        </div>
      </div>

      <div style={{ 
        marginTop: 40, 
        padding: 20, 
        background: '#f0fdf4', 
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <h3>📞 Contact କରନ୍ତୁ</h3>
        <p style={{ fontSize: 18, fontWeight: 600 }}>+91 98765 43210</p>
        <p>Biswakarma Agro, Main Road, Your City</p>
      </div>

    </div>
  )
}