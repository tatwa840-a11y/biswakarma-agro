'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { FiSettings, FiPlus, FiPackage, FiTrendingUp, FiAlertTriangle, FiSearch, FiFilter, FiMoreVertical } from 'react-icons/fi';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => {
    const price = Number(p.sellingPrice) || 0;
    const stock = Number(p.openingStock) || 0;
    return sum + (price * stock);
  }, 0);
  const lowStockCount = products.filter(p => {
    const stock = Number(p.openingStock) || 0;
    const alert = Number(p.minStockAlert) || 0;
    return stock <= alert;
  }).length;
  const filteredProducts = products.filter(p => 
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading Dashboard... ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <FiPackage className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  BISWAKARMA <span className="text-green-600">AGRO</span>
                </h1>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/settings">
                <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                  <FiSettings size={24} />
                </button>
              </Link>
              <Link href="/add-product">
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all active:scale-95">
                  <FiPlus size={20} />
                  <span>Add Product</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Overview / ସମୀକ୍ଷା</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening with your inventory today.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase mb-1">Total Products / ମୋଟ ପ୍ରଡକ୍ଟ</p>
              <h3 className="text-4xl font-black text-slate-900">{totalProducts}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <FiPackage className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase mb-1">Stock Value / ଷ୍ଟକ୍ ମୂଲ୍ୟ</p>
              <h3 className="text-4xl font-black text-slate-900">₹{totalStockValue.toLocaleString()}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <FiTrendingUp className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase mb-1">Low Stock / କମ୍ ଷ୍ଟକ୍</p>
              <h3 className="text-4xl font-black text-red-600">{lowStockCount}</h3>
            </div>
            <div className="bg-red-50 p-3 rounded-xl">
              <FiAlertTriangle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-800">Inventory List / ତାଲିକା</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-full md:w-64" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100">
                <FiFilter size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Brand & Category</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLowStock = (Number(p.openingStock) || 0) <= (Number(p.minStockAlert) || 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <FiPackage size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-green-700 transition-colors">{p.productName}</p>
                            <p className="text-xs text-slate-500">ID: {p.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">{p.brand || 'N/A'}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit mt-1">{p.category || 'General'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{p.openingStock || '0'} {p.unit}</span>
                          <span className="text-xs text-slate-500">Min Alert: {p.minStockAlert || '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-extrabold text-slate-900">₹{Number(p.sellingPrice).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            !isLowStock ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${!isLowStock ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                            {!isLowStock ? 'In Stock' : 'Low Stock'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <FiMoreVertical />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <FiSearch size={48} className="text-slate-300" />
                </div>
                <p className="text-lg font-semibold">No products found / କିଛି ମିଳିଲା ନାହିଁ</p>
                <p className="text-sm">Try adjusting your search or add a new product.</p>
                <Link href="/add-product" className="mt-4 text-green-600 font-bold hover:underline">
                  + Add New Product
                </Link>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-700">{filteredProducts.length}</span> of <span className="font-bold text-slate-700">{totalProducts}</span> products
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </main>
      <Link href="/dashboard/settings">
        <button className="fixed bottom-8 right-8 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 text-slate-600 hover:text-green-600 transition-all hover:scale-110 active:scale-95 group">
          <FiSettings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Settings / ସେଟିଂସ
          </span>
        </button>
      </Link>
    </div>
  );
}