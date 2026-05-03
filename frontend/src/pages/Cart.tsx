import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  quantity: number;
  menu_item: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    try {
      const response = await axios.get('http://localhost:8000/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.warn("Backend API not reachable. Using mock cart.");
      const mockCart = JSON.parse(localStorage.getItem(`mockCart_${token}`) || '[]');
      setCartItems(mockCart);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/cart/${id}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (error) {
      console.warn("Backend API not reachable. Using mock cart.");
      let mockCart = JSON.parse(localStorage.getItem(`mockCart_${token}`) || '[]');
      const itemIndex = mockCart.findIndex((i: any) => i.id === id);
      if (itemIndex > -1) {
        mockCart[itemIndex].quantity = newQuantity;
        localStorage.setItem(`mockCart_${token}`, JSON.stringify(mockCart));
      }
      fetchCart();
    }
  };

  const removeItem = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (error) {
      console.warn("Backend API not reachable. Using mock cart.");
      let mockCart = JSON.parse(localStorage.getItem(`mockCart_${token}`) || '[]');
      mockCart = mockCart.filter((i: any) => i.id !== id);
      localStorage.setItem(`mockCart_${token}`, JSON.stringify(mockCart));
      fetchCart();
    }
  };

  const handleCheckout = async () => {
    if (!address) {
      alert("Please enter a delivery address");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8000/orders', {
        delivery_address: address,
        total_amount: total
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Order placed successfully!");
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0);

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '4rem' }}>
      <h1 style={{ margin: '2rem 0' }}>Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Your cart is empty.</h3>
          <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{marginTop: '1rem'}}>Browse Menu</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.menu_item.image_url} alt={item.menu_item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.menu_item.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.menu_item.price}</p>
                </div>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="btn btn-outline" style={{padding: '0.5rem', color: 'var(--accent)', borderColor: 'var(--accent)'}}>Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹20.00</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{(total + 20).toFixed(2)}</span>
            </div>
            
            <div className="form-group" style={{marginTop: '2rem'}}>
              <label className="form-label" style={{color: 'white'}}>Delivery Address</label>
              <textarea 
                className="form-control" 
                rows={3} 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                required
              ></textarea>
            </div>
            
            <button onClick={handleCheckout} className="btn" style={{background: 'white', color: 'var(--primary)', width: '100%', marginTop: '1rem', padding: '1rem'}}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
