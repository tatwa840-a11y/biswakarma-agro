'use client';
import { useEffect, useState, useMemo } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  FiShoppingCart, 
  FiSearch, 
  FiTrash2, 
  FiFilter, 
  FiPackage, 
  FiTag, 
  FiCheckCircle, 
  FiXCircle,
  FiArrowRight,
  FiPlus
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, Toaster } from 'sonner';

const CATEGORIES = [
  { key: 'all',        label: 'All',        icon: '🛒' },
  { key: 'seeds',      label: 'Seeds',      icon: '🌾' },
  { key: 'fertilizer', label: 'Fertilizer', icon: '🧪' },
  { key: 'pesticide',  label: 'Pesticide',  icon: '🐛' },
  { key: 'herbicide',  label: 'Herbicide',  icon: '🌿' },
  { key: 'equipment',  label: 'Equipment',  icon: '🔧' },
  { key: 'organic',    label: 'Organic',    icon: '🍃' },
  { key: 'other',      label: 'Other',      icon: '📦' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const adminEmails = ['admin@biswakarma.com', 'your-email@gmail.com'];
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
        const productsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const validProducts = productsData.filter(p => p.productName && p.sellingPrice);
        setProducts(validProducts);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Product Load ହେଲାନି');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p =>
        p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      result = result.filter(p =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [searchTerm, activeCategory, products]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.productName} cart କୁ Add ହେଲା!`);
  };

  const handleDelete = async (e, id, productName) => {
    e.stopPropagation();
    if (!isAdmin) { toast.error('Only Admin Delete କରିପାରିବ'); return; }
    if (!window.confirm(`Delete "${productName}"? ଏଇଟା Undo ହେବନି!`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product Delete ହେଲା ✅');
    } catch (error) {
      toast.error('Delete Failed');
    }
    setDeletingId(null);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.key] = cat.key === 'all'
        ? products.length
        : products.filter(p => p.category?.toLowerCase() === cat.key).length;
      return acc;
    }, {});
  }, [products]);

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: '#f8fafc', 
      gap: 16,
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        width: 48, 
        height: 48, 
        border: '3px solid #e2e8f0', 
        borderTop: '3px solid #16a34a', 
        borderRadius: '50%', 
        animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite' 
      }} />
      <p style={{ color: '#64748b', fontWeight: 500, fontSize: 14 }}>Preparing your shop...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const styles = {
    page: { 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
      color: '#1e293b'
    },
    nav: { 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(12px)',
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      borderBottom: '1px solid #f1f5f9'
    },
    navInner: { 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '0 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      height: 72 
    },
    logo: { 
      fontSize: 20, 
      fontWeight: 800, 
      color: '#0f172a', 
      display: 'flex', 
      alignItems: 'center', 
      gap: 10,
      letterSpacing: '-0.02em'
    },
    logoBadge: { 
      background: '#16a34a', 
      padding: '4px 10px', 
      borderRadius: 8, 
      fontSize: 10, 
      fontWeight: 700, 
      color: 'white',
      textTransform: 'uppercase'
    },
    cartBtn: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: 10, 
      background: '#0f172a', 
      color: 'white', 
      border: 'none', 
      borderRadius: '12px', 
      padding: '10px 20px', 
      fontSize: 14, 
      fontWeight: 600, 
      cursor: 'pointer', 
      position: 'relative',
      transition: 'all 0.2s'
    },
    cartBadge: { 
      position: 'absolute', 
      top: -6, 
      right: -6, 
      background: '#16a34a', 
      color: 'white', 
      borderRadius: '50%', 
      width: 20, 
      height: 20, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: 11, 
      fontWeight: 700,
      boxShadow: '0 0 0 3px white'
    },
    header: {
      padding: '40px 24px 24px',
      maxWidth: 1200,
      margin: '0 auto'
    },
    searchContainer: {
      position: 'relative',
      maxWidth: 600,
      marginBottom: 32
    },
    searchInput: { 
      width: '100%', 
      padding: '14px 16px 14px 52px', 
      border: '1px solid #e2e8f0', 
      borderRadius: '16px', 
      fontSize: 15, 
      outline: 'none', 
      background: 'white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'all 0.2s'
    },
    searchIcon: { 
      position: 'absolute', 
      left: 18, 
      top: '50%', 
      transform: 'translateY(-50%)', 
      color: '#94a3b8' 
    },
    filterScroll: { 
      display: 'flex', 
      gap: 10, 
      overflowX: 'auto', 
      padding: '4px 0 20px',
      msOverflowStyle: 'none', 
      scrollbarWidth: 'none' 
    },
    catBtn: (active) => ({ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8, 
      padding: '10px 18px', 
      borderRadius: '14px', 
      border: active ? 'none' : '1px solid #e2e8f0', 
      background: active ? '#16a34a' : 'white', 
      fontSize: 14, 
      fontWeight: 600, 
      color: active ? 'white' : '#64748b', 
      cursor: 'pointer', 
      whiteSpace: 'nowrap', 
      transition: 'all 0.2s',
      boxShadow: active ? '0 10px 15px -3px rgba(16, 185, 129, 0.2)' : 'none'
    }),
    grid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: 24,
      padding: '0 24px 40px',
      maxWidth: 1200,
      margin: '0 auto'
    },
    card: { 
      background: 'white', 
      borderRadius: '24px', 
      overflow: 'hidden', 
      border: '1px solid #f1f5f9', 
      cursor: 'pointer', 
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column'
    },
    cardImgWrap: { 
      height: 220, 
      background: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative'
    },
    cardImg: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'contain',
      padding: 24
    },
    catTag: { 
      position: 'absolute', 
      top: 16, 
      left: 16, 
      background: 'rgba(255,255,255,0.9)', 
      backdropFilter: 'blur(4px)',
      color: '#1e293b', 
      fontSize: 11, 
      fontWeight: 700, 
      padding: '6px 12px', 
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    cardBody: { 
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    stockBadge: (inStock) => ({ 
      display: 'inline-flex', 
      alignItems: 'center',
      gap: 4,
      fontSize: 11, 
      fontWeight: 700, 
      padding: '4px 10px', 
      borderRadius: '8px', 
      background: inStock ? '#f0fdf4' : '#fef2f2', 
      color: inStock ? '#166534' : '#991b1b',
      marginBottom: 12
    }),
    cardName: { 
      fontSize: 17, 
      fontWeight: 700, 
      color: '#0f172a', 
      margin: '0 0 6px', 
      lineHeight: 1.3 
    },
    cardMeta: { 
      fontSize: 13, 
      color: '#64748b', 
      display: 'flex', 
      alignItems: 'center', 
      gap: 6,
      marginBottom: 4
    },
    cardFooter: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginTop: 'auto', 
      paddingTop: 20, 
      borderTop: '1px solid #f1f5f9' 
    },
    price: { 
      fontSize: 24, 
      fontWeight: 800, 
      color: '#0f172a', 
      display: 'flex',
      alignItems: 'baseline',
      gap: 2
    },
    btnAdd: (inStock) => ({ 
      width: 44,
      height: 44,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: inStock ? '#16a34a' : '#f1f5f9', 
      color: inStock ? 'white' : '#94a3b8', 
      border: 'none', 
      borderRadius: '14px', 
      cursor: inStock ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s',
      boxShadow: inStock ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
    }),
    btnDelete: { 
      position: 'absolute',
      top: 16,
      right: 16,
      width: 36,
      height: 36,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'rgba(255, 255, 255, 0.9)', 
      color: '#ef4444', 
      border: 'none', 
      borderRadius: '10px', 
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <Toaster richColors position="bottom-center" />

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <div style={{ background: '#16a34a', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiPackage color="white" size={18} />
            </div>
            Biswakarma Agro
            <span style={styles.logoBadge}>STORE</span>
          </div>
          <button style={styles.cartBtn} onClick={() => router.push('/cart')}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      <header style={styles.header}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>
          Explore <span style={{ color: '#16a34a' }}>Products</span>
        </h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Quality agro products for your farming needs</p>

        <div style={styles.searchContainer}>
          <FiSearch style={styles.searchIcon} size={20} />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search products or brands..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = '#16a34a';
              e.target.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }}
          />
        </div>

        <div style={styles.filterScroll}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.key;
            return (
              <button key={cat.key} style={styles.catBtn(active)} onClick={() => setActiveCategory(cat.key)}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                {cat.label}
                <span style={{ 
                  fontSize: 11, 
                  marginLeft: 4, 
                  opacity: 0.7,
                  background: active ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}>
                  {categoryCounts[cat.key]}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <main style={styles.grid}>
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🍃</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>No products found</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Try searching for something else or change category</p>
          </div>
        ) : (
          filteredProducts.map(product => {
            const inStock = product.stockStatus === 'In Stock';
            const catMeta = CATEGORIES.find(c => c.key === product.category?.toLowerCase());
            return (
              <div
                key={product.id}
                style={styles.card}
                onClick={() => router.push(`/products/${product.id}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = '#16a34a30';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                }}
              >
                <div style={styles.cardImgWrap}>
                  {product.category && (
                    <span style={styles.catTag}>{catMeta?.icon || '📦'} {product.category}</span>
                  )}
                  {isAdmin && (
                    <button
                      style={styles.btnDelete}
                      onClick={e => handleDelete(e, product.id, product.productName)}
                      disabled={deletingId === product.id}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.productName} style={styles.cardImg} />
                    : <div style={{ fontSize: 60, opacity: 0.2 }}>🚜</div>}
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.stockBadge(inStock)}>
                    {inStock ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                  
                  <h3 style={styles.cardName}>{product.productName}</h3>
                  
                  <div style={{ marginBottom: 16 }}>
                    {product.brand && (
                      <div style={styles.cardMeta}>
                        <FiTag size={12} color="#16a34a" /> {product.brand}
                      </div>
                    )}
                    {product.packSize && (
                      <div style={styles.cardMeta}>
                        <FiPackage size={12} color="#16a34a" /> {product.packSize} {product.unit}
                      </div>
                    )}
                  </div>

                  <div style={styles.cardFooter}>
                    <div style={styles.price}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginRight: 2 }}>₹</span>
                      {product.sellingPrice}
                    </div>
                    <button
                      style={styles.btnAdd(inStock)}
                      onClick={e => handleAddToCart(e, product)}
                      disabled={!inStock}
                      onMouseEnter={e => { if(inStock) e.currentTarget.style.background = '#15803d'; }}
                      onMouseLeave={e => { if(inStock) e.currentTarget.style.background = '#16a34a'; }}
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
