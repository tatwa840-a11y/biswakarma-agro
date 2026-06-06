'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'))
    const productsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setProducts(productsList)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (confirm('Delete କରିବା?')) {
      await deleteDoc(doc(db, 'products', id))
      fetchProducts()
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => router.push('/admin')} style={{ marginBottom: 20 }}>← Dashboard</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ color: '#16a34a' }}>📦 Products List</h1>
        <Link href="/add-product">
          <button style={{ padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6 }}>
            + Add Product
          </button>
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ border: '1px solid #ddd', padding: 12, textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: 12, textAlign: 'left' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: 12, textAlign: 'left' }}>Stock</th>
            <th style={{ border: '1px solid #ddd', padding: 12, textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ddd', padding: 12 }}>{product.name}</td>
              <td style={{ border: '1px solid #ddd', padding: 12 }}>₹{product.price}</td>
              <td style={{ border: '1px solid #ddd', padding: 12 }}>{product.stock}</td>
              <td style={{ border: '1px solid #ddd', padding: 12 }}>
                <button onClick={() => handleDelete(product.id)} style={{ padding: '6px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && <p style={{ marginTop: 20 }}>କୌଣସି Product ନାହିଁ। Add Product କର।</p>}
    </div>
  )
}