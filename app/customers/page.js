'use client'
import { useState, useEffect, useMemo } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { FiUser, FiPhone, FiMapPin, FiSearch, FiTrendingUp, FiDollarSign, FiUsers, FiCalendar, FiEye, FiGrid, FiList } from 'react-icons/fi'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or table

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'))
      const ordersData = querySnapshot.docs.map(doc => doc.data())

      const customerMap = {}
      ordersData.forEach(order => {
        const phone = order.phone
        if (!customerMap[phone]) {
          customerMap[phone] = {
            name: order.customerName,
            phone: order.phone,
            address: order.address || '',
            pincode: order.pincode || '',
            city: order.city || '',
            state: order.state || '',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null
          }
        }
        customerMap[phone].totalOrders += 1
        customerMap[phone].totalSpent += order.totalAmount || 0

        const orderDate = order.createdAt?.toDate()
        if (!customerMap[phone].lastOrderDate || orderDate > customerMap[phone].lastOrderDate) {
          customerMap[phone].lastOrderDate = orderDate
        }
      })

      const customersList = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent)
      setCustomers(customersList)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [customers, searchQuery])

  const stats = useMemo(() => {
    const total = customers.length
    const revenue = customers.reduce((acc, curr) => acc + curr.totalSpent, 0)
    const avgSpent = total > 0? (revenue / total).toFixed(0) : 0
    const topCustomer = customers[0]
    return { total, revenue, avgSpent, topCustomer }
  }, [customers])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Loading customers...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Customer <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Insights</span>
              </h1>
              <p className="text-slate-600">Track and manage your customer relationships</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl ${viewMode === 'grid'? 'bg-green-600 text-white' : 'bg-white text-slate-600'} shadow-lg`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-3 rounded-xl ${viewMode === 'table'? 'bg-green-600 text-white' : 'bg-white text-slate-600'} shadow-lg`}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Customers', value: stats.total, icon: FiUsers, color: 'from-blue-500 to-blue-600' },
            { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: FiDollarSign, color: 'from-green-500 to-green-600' },
            { label: 'Avg. Value', value: `₹${stats.avgSpent}`, icon: FiTrendingUp, color: 'from-purple-500 to-purple-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="text-white" size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Customer Banner */}
        {stats.topCustomer && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">🏆 TOP CUSTOMER</p>
                <h3 className="text-2xl font-bold mb-1">{stats.topCustomer.name}</h3>
                <p className="text-orange-100">₹{stats.topCustomer.totalSpent.toLocaleString()} • {stats.topCustomer.totalOrders} Orders</p>
              </div>
              <FiUser size={60} className="text-white opacity-20" />
            </div>
          </div>
        )}

        {/* Customers List */}
        {filteredCustomers.length === 0? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No customers found</h3>
            <p className="text-slate-500">Try adjusting your search</p>
          </div>
        ) : viewMode === 'grid'? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                {/* Top Badge */}
                {idx < 3 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    #{idx + 1} TOP
                  </div>
                )}

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiUser className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{customer.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <FiPhone size={14} className="text-green-600" /> {customer.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex items-start gap-2">
                    <FiMapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {customer.address}, {customer.city}, {customer.state} - <span className="font-semibold">{customer.pincode}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">ORDERS</p>
                    <p className="text-2xl font-bold text-slate-900">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">REVENUE</p>
                    <p className="text-2xl font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiCalendar size={14} />
                    <span className="text-xs">
                      Last: {customer.lastOrderDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <button className="text-green-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View <FiEye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">City</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Revenue</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                            <FiUser className="text-white" size={20} />
                          </div>
                          <span className="font-semibold text-slate-900">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{customer.phone}</td>
                      <td className="px-6 py-4 text-slate-600">{customer.city}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{customer.totalOrders}</td>
                      <td className="px-6 py-4 font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {customer.lastOrderDate?.toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}