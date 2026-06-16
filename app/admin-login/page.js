'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { FiLogOut, FiUsers, FiBox, FiDollarSign, FiPlus, FiGift, FiShoppingCart, FiTrendingUp } from 'react-icons/fi'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ customers: 0, products: 0, orders: 0, sales: 0 })
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        loadStats()
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const loadStats = async () => {
    const customersSnap = await getDocs(collection(db, 'customers'))
    const productsSnap = await getDocs(collection(db, 'products'))
    setStats({
      customers: customersSnap.size,
      products: productsSnap.size,
      orders: 12,
      sales: 18500
    })
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const cards = [
    {
      title: 'Customers',
      subtitle: 'Customer List ଦେଖନ୍ତୁ',
      count: stats.customers,
      icon: FiUsers,
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/customers'
    },
    {
      title: 'Products',
      subtitle: 'Edit & Delete କରନ୍ତୁ',
      count: stats.products,
      icon: FiBox,
      bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/admin-login/products'
    },
    {
      title: 'Orders',
      subtitle: 'Manage Orders',
      count: stats.orders,
      icon: FiShoppingCart,
      bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      link: '/admin-login/orders'
    },
    {
      title: 'Sales',
      subtitle: 'Sales Report ଦେଖନ୍ତୁ',
      count: `₹${stats.sales}`,
      icon: FiDollarSign,
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/sales'
    },
    {
      title: 'Add Product',
      subtitle: 'ନୂଆ Product Add କରନ୍ତୁ',
      icon: FiPlus,
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      link: '/add-product'
    },
    {
      title: 'Offers',
      subtitle: 'Daily Offer Manage କରନ୍ତୁ',
      icon: FiGift,
      bg: 'bg-gradient-to-br from-red-500 to-red-600',
      link: '/offers'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiBox className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                BISWAKARMA AGRO
              </h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-sm hidden md:block">Hi, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back! 👋</h2>
                <p className="text-green-100 text-lg">Manage your agro business efficiently</p>
              </div>
              <FiTrendingUp size={80} className="text-white opacity-20 hidden lg:block" />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link key={index} href={card.link}>
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-5">
                  <div className={`${card.bg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="text-white" size={32} />
                  </div>
                  {card.count!== undefined && (
                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-800">{card.count}</p>
                      <p className="text-xs text-slate-500 mt-1">Total</p>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500">{card.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-5">📊 Today's Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <p className="text-3xl font-bold text-blue-600">{stats.customers}</p>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Customers</p>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <p className="text-3xl font-bold text-purple-600">{stats.products}</p>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Products</p>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <p className="text-3xl font-bold text-green-600">₹{stats.sales}</p>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Sales</p>
            </div>
            <div className="text-center p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <p className="text-3xl font-bold text-orange-600">{stats.orders}</p>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}