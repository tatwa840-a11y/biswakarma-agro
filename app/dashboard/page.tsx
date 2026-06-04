'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

// 🔥 Product Type ବନାଇଦେଲି
type Product = {
  id: string;
  productName?: string;
  brand?: string;
  category?: string;
  openingStock?: number | string;
  sellingPrice?: number | string;
  minStockAlert?: number | string;
  unit?: string;
  imageUrl?: string;
}

export default function Dashboard() {
  // 🔥 <Product[]> Type ଦେଇଦେଲି
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Product)); // 🔥 as Product ଦେଇଦେଲି
      setProducts(productsData);
      setLoading(false);
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

  if (loading) return <div className="p-8 text-center text-xl">Loading... ⏳</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">🌾 BISWAKARMA AGRO Dashboard</h1>
          <Link href="/add-product">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"> + Add New Product </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600">Total Products / ମୋଟ ପ୍ରଡକ୍ଟ</p>
            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-gray-600">Stock Value / ଷ୍ଟକ୍ ମୂଲ୍ୟ</p>
            <p className="text-3xl font-bold text-green-600">₹{totalStockValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <p className="text-gray-600">Low Stock / କମ୍ ଷ୍ଟକ୍</p>
            <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name / ନାମ</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Price / ଦାମ୍</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3"> 
                    {p.imageUrl ? 
                      <img src={p.imageUrl} alt={p.productName} className="w-12 h-12 object-cover rounded" /> 
                      : 'No Image'}
                  </td>
                  <td className="p-3 font-semibold">{p.productName}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.openingStock || '0'} {p.unit}</td>
                  <td className="p-3">₹{p.sellingPrice || '0'}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      (Number(p.openingStock) || 0) > (Number(p.minStockAlert) || 0) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {(Number(p.openingStock) || 0) > (Number(p.minStockAlert) || 0) ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              କିଛି Product ନାହିଁ। Add New Product ଦବାଇ Add କରନ୍ତୁ।
            </p>
          )}
        </div>
      </div>
    </div>
  );
}