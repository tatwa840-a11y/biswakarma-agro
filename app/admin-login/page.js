'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login') // Login ନଥିଲେ Login Page କୁ
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ color: '#16a34a' }}>🌾 BISWAKARMA AGRO Dashboard</h1>
        <div>
          <span style={{ marginRight: 15 }}>Hi, {user?.email}</span>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>

        <Link href="/customers" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer', background: '#f9fafb' }}>
            <h2 style={{ color: '#16a34a', margin: 0 }}>👥 Customers</h2>
            <p style={{ color: '#666', marginTop: 8 }}>Customer List ଦେଖନ୍ତୁ</p>
          </div>
        </Link>

        <Link href="/products" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer', background: '#f9fafb' }}>
            <h2 style={{ color: '#16a34a', margin: 0 }}>📦 Products</h2>
            <p style={{ color: '#666', marginTop: 8 }}>Product Manage କରନ୍ତୁ</p>
          </div>
        </Link>

        <Link href="/sales" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer', background: '#f9fafb' }}>
            <h2 style={{ color: '#16a34a', margin: 0 }}>💰 Sales</h2>
            <p style={{ color: '#666', marginTop: 8 }}>Sales Report ଦେଖନ୍ତୁ</p>
          </div>
        </Link>

        <Link href="/add-product" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, cursor: 'pointer', background: '#f9fafb' }}>
            <h2 style={{ color: '#16a34a', margin: 0 }}>➕ Add Product</h2>
            <p style={{ color: '#666', marginTop: 8 }}>ନୂଆ Product Add କରନ୍ତୁ</p>
          </div>
        </Link>

      </div>
    </div>
  )
}