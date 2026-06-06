"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.id === product.id
           ? {...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        productName: product.productName,
        sellingPrice: Number(product.sellingPrice),
        imageUrl: product.imageUrl,
        brand: product.brand,
        qty: 1
      }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id!== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems(prev =>
      prev.map(item => item.id === id? {...item, qty } : item)
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);