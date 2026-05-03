import React, { createContext, useContext, useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface CartItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  menu_item: MenuItem;
}

interface Address {
  fullName: string;
  street: string;
  area: string;
  phone: string;
}

interface CartContextType {
  cart: CartItem[];
  address: Address | null;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  saveAddress: (address: Address) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('foodvilla_cart');
    const savedAddress = localStorage.getItem('foodvilla_address');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedAddress) setAddress(JSON.parse(savedAddress));
  }, []);

  useEffect(() => {
    localStorage.setItem('foodvilla_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (address) localStorage.setItem('foodvilla_address', JSON.stringify(address));
  }, [address]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.menu_item_id === item.id);
      if (existingItem) {
        return prevCart.map(i => i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { id: Date.now(), menu_item_id: item.id, quantity: 1, menu_item: item }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const saveAddress = (newAddress: Address) => setAddress(newAddress);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, address, addToCart, removeFromCart, updateQuantity, clearCart, saveAddress, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
