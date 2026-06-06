'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function ProductDetails({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const id = params.id;

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        alert('Product ନାହିଁ!');
        router.push('/products');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!product) return <div style={{ padding: 20 }}>Product ନାହିଁ।</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <button onClick={() => router.back()} style={{ marginBottom: 20 }}>← Back</button>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.productName} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }} />
      )}
      <h1 style={{ fontSize: 24, margin: '10px 0' }}>{product.productName}</h1>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Technical Name:</strong> {product.technicalName}</p>
      <p><strong>Pack Size:</strong> {product.packSize} {product.unit}</p>
      <p style={{ fontSize: 24, fontWeight: 'bold', color: '#16a34a' }}>₹{product.sellingPrice}</p>
      <p style={{ color: product.stockStatus === 'In Stock' ? '#16a34a' : '#dc2626' }}>
        {product.stockStatus}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: 60, padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
        />
      </div>

      <button
        onClick={() => alert(`Added ${quantity} ${product.productName} to cart!`)}
        style={{ marginTop: 20, padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', width: '100%' }}
      >
        Add to Cart
      </button>
    </div>
  );
}