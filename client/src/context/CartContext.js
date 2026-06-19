import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (food) =>
    setItems((prev) => {
      const hit = prev.find((i) => i._id === food._id);
      return hit
        ? prev.map((i) => (i._id === food._id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...food, quantity: 1 }];
    });

  const removeItem = (id) =>
    setItems((prev) => {
      const hit = prev.find((i) => i._id === id);
      return hit?.quantity === 1
        ? prev.filter((i) => i._id !== id)
        : prev.map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i));
    });

  const clearCart = () => setItems([]);

  const total     = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
