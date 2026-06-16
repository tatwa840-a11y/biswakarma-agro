'use client'
import { useState, useEffect, useMemo } from 'react'
import { db } from '../../../lib/firebase'
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Trash2, Edit, ArrowLeft, Save, X, Package, Search, Filter, Plus, DollarSign, Box, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

export default function ProductsManagePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [editData, setEditData] = useState({})
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsList)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleDelete = async (id, name) => {
    if (confirm(`${name || 'Product'} Delete କରିବ?`)) {
      await deleteDoc(doc(db, 'products', id))
      toast.success('Product Delete ହେଲା')
    }
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditData({
      productName: product.productName || '',
      category: product.category || '',
      brand: product.brand || '',
      technicalName: product.technicalName || '',
      packSize: product.packSize || '',
      unit: product.unit || 'ml',
      sellingPrice: product.sellingPrice || product.price || '',
      mrp: product.mrp || '',
      purchasePrice: product.purchasePrice || '',
      openingStock: product.openingStock || '',
      minStockAlert: product.minStockAlert || '',
      imageUrl: product.imageUrl || ''
    })
  }

  const saveEdit = async (id) => {
    if (!editData.productName || !editData.sellingPrice) {
      toast.error('Product Name ଆଉ Selling Price ଦରକାର')
      return
    }
    
    const stock = Number(editData.openingStock)
    const minStock = Number(editData.minStockAlert)
    
    await updateDoc(doc(db, 'products', id), {
      productName: editData.productName,
      category: editData.category,
      brand: editData.brand,
      technicalName: editData.technicalName,
      packSize: editData.packSize,
      unit: editData.unit,
      sellingPrice: Number(editData.sellingPrice),
      price: Number(editData.sellingPrice),
      mrp: Number(editData.mrp),
      purchasePrice: Number(editData.purchasePrice),
      openingStock: stock,
      minStockAlert: minStock,
      imageUrl: editData.imageUrl,
      stockStatus: stock > minStock ? 'In Stock' : 'Low Stock'
    })
    setEditingId(null)
    toast.success('Product Update ହେଲା ✅')
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'All' || product.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, filterCategory])

  const stats = useMemo(() => {
    const total = products.length
    const lowStock = products.filter(p => (p.openingStock || 0) <= (p.minStockAlert || 10)).length
    const totalValue = products.reduce((sum, p) => sum + ((p.openingStock || 0) * (p.purchasePrice || 0)), 0)
    return { total, lowStock, totalValue }
  }, [products])

  const categories = ['All', 'Insecticide', 'Fungicide', 'Herbicide', 'Fertilizer', 'Seed']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-slate-300 p-2 hover:bg-slate-700 rounded-xl transition">
              <ArrowLeft size={24} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Product Manage</h1>
              <p className="text-slate-400 text-sm">{stats.total} Products</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/add-product')}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus size={20} /> Add New
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Products', value: stats.total, icon: Box, color: 'from-blue-500 to-blue-600' },
            { label: 'Low Stock Alert', value: stats.lowStock, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
            { label: 'Stock Value', value: `₹${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product or brand..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none focus:ring-2 focus:ring-orange-500 text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                    filterCategory === cat
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-2xl border border-slate-700 text-center">
            <Package size={64} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Products Found</h3>
            <p className="text-slate-500">Add products or change filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-orange-500/50 transition-all group">
                {editingId === product.id ? (
                  // Edit Mode
                  <div className="p-5 space-y-3">
                    <input
                      value={editData.productName}
                      onChange={(e) => setEditData({...editData, productName: e.target.value})}
                      placeholder="Product Name *"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={editData.brand}
                        onChange={(e) => setEditData({...editData, brand: e.target.value})}
                        placeholder="Brand"
                        className="px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none"
                      />
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                        className="px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none"
                      >
                        <option value="">Category</option>
                        <option value="Insecticide">Insecticide</option>
                        <option value="Fungicide">Fungicide</option>
                        <option value="Herbicide">Herbicide</option>
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Seed">Seed</option>
                      </select>
                    </div>
                    <input
                      value={editData.imageUrl}
                      onChange={(e) => setEditData({...editData, imageUrl: e.target.value})}
                      placeholder="Image URL"
                      className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={editData.sellingPrice}
                        onChange={(e) => setEditData({...editData, sellingPrice: e.target.value})}
                        placeholder="Price *"
                        className="px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none"
                      />
                      <input
                        type="number"
                        value={editData.mrp}
                        onChange={(e) => setEditData({...editData, mrp: e.target.value})}
                        placeholder="MRP"
                        className="px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none"
                      />
                      <input
                        type="number"
                        value={editData.openingStock}
                        onChange={(e) => setEditData({...editData, openingStock: e.target.value})}
                        placeholder="Stock"
                        className="px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(product.id)} className="flex-1 bg-green-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700">
                        <Save size={18} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-700">
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="relative h-48 bg-slate-700">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.productName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={64} className="text-slate-600" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button onClick={() => startEdit(product)} className="bg-orange-600 p-2.5 rounded-xl hover:bg-orange-700 shadow-lg">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id, product.productName)} className="bg-red-600 p-2.5 rounded-xl hover:bg-red-700 shadow-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {(product.openingStock || 0) <= (product.minStockAlert || 10) && (
                        <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
                          LOW STOCK
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white flex-1">{product.productName}</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{product.brand} • {product.category}</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-orange-500">₹{product.sellingPrice || product.price}</span>
                        {product.mrp && product.mrp > (product.sellingPrice || product.price) && (
                          <span className="text-slate-500 line-through">₹{product.mrp}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Stock: <span className="text-white font-semibold">{product.openingStock || 0}</span></span>
                        <span className="text-slate-400">{product.packSize}{product.unit}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}