'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Admin Check
  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  // 1. Admin Check କରିବା
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Firebase ରେ User Custom Claims କିମ୍ବା Firestore 'users' collection Check କର
        // Example: Admin Email Check
        const adminEmails = ['admin@biswakarma.com', 'your-email@gmail.com']; // ତୁମ Admin Email ଏଠି ଦିଅ
        setIsAdmin(adminEmails.includes(user.email));
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const validProducts = productsData.filter(p => p.productName && p.sellingPrice);
        setProducts(validProducts);
        setFilteredProducts(validProducts);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Product Load ହେଲାନି');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const result = products.filter(p => 
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(result);
  }, [searchTerm, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.productName} cart କୁ Add ହେଲା!`);
  };

  const handleDelete = async (e, id, productName, imageUrl) => {
    e.stopPropagation();
    if (!isAdmin) {
      toast.error('Only Admin Delete କରିପାରିବ');
      return;
    }
    
    const confirm = window.confirm(`Delete "${productName}"? ଏଇଟା Undo ହେବନି!`);
    if (!confirm) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      setFilteredProducts(filteredProducts.filter(p => p.id !== id));
      toast.success('Product Delete ହେଲା ✅');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete Failed');
    }
    setDeletingId(null);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 50, height: 50, border: '4px solid #f3f3f3', borderTop: '4px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Toaster richColors />
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#16a34a', margin: 0 }}>Biswakarma Agro 🌾</h1>
            <button onClick={() => router.push('/cart')} style={{ position: 'relative', padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiShoppingCart size={20} />
              Cart
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -8, background: '#dc2626', color: 'white', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
            <input 
              type="text" 
              placeholder="Search products by name or brand..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 44px', border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 16, outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, color: '#0f172a' }}>All Products ({filteredProducts.length})</h2>
        
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            <p style={{ fontSize: 18 }}>No products found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => router.push(`/products/${product.id}`)} 
                style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid #e2e8f0', position: 'relative' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)'; }}
              >
                <div style={{ height: 220, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>No Image</div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ background: product.stockStatus === 'In Stock' ? '#dcfce7' : '#fee2e2', color: product.stockStatus === 'In Stock' ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                      {product.stockStatus}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: '8px 0', color: '#0f172a', height: 40, overflow: 'hidden' }}>
                    {product.productName}
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0' }}>{product.brand}</p>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 12px' }}>{product.packSize} {product.unit}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 8 }}>
                    <p style={{ fontSize: 24, fontWeight: 700, color: '#16a34a', margin: 0 }}>₹{product.sellingPrice}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {/* Delete Button - କେବଳ Admin ଦେଖିବ */}
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDelete(e, product.id, product.productName, product.imageUrl)}
                          disabled={deletingId === product.id}
                          style={{ padding: '8px', background: deletingId === product.id ? '#94a3b8' : '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: deletingId === product.id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                          title="Delete Product"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleAddToCart(e, product)} 
                        disabled={product.stockStatus !== 'In Stock'}
                        style={{ padding: '8px 12px', background: product.stockStatus === 'In Stock' ? '#16a34a' : '#94a3b8', color: 'white', border: 'none', borderRadius: 8, cursor: product.stockStatus === 'In Stock' ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <FiShoppingCart size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}