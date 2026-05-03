import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartCount, address, saveAddress } = useCart();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    street: address?.street || '',
    area: address?.area || 'CRPF Square',
    phone: address?.phone || ''
  });

  const total = cart.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddress(formData);
    setShowAddressForm(false);
  };

  if (cart.length === 0) {
    return (
      <div className="page-wrapper container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒 Your Cart is Empty</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Looks like you haven't added any tiffins yet.</p>
        <Link to="/menu" className="btn btn-primary">Go to Menu</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper container">
      <h1 style={{ margin: '2rem 0' }}>Your Shopping Cart ({cartCount} items)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item fade-in">
              <img src={item.menu_item.image_url} alt={item.menu_item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.menu_item.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.menu_item.price}</p>
              </div>
              
              <div className="qty-controls">
                <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
              </div>

              <div style={{ marginLeft: '1rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                ₹{item.menu_item.price * item.quantity}
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '1rem' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-main)', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Order Summary</h3>
          
          {/* Address Section */}
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--background)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>📍 Delivery Address</strong>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {address ? 'Change' : 'Add'}
              </button>
            </div>

            {address && !showAddressForm ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{address.fullName}</p>
                <p>{address.street}</p>
                <p>{address.area}, Bhubaneswar</p>
                <p>📞 {address.phone}</p>
              </div>
            ) : showAddressForm ? (
              <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="form-control" 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Street / Flat / Landmark" 
                  className="form-control" 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  required 
                />
                <select 
                  className="form-control" 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                >
                  <option>CRPF Square</option>
                  <option>Jayadev Vihar</option>
                  <option>Nayapalli</option>
                  <option>Khandagiri</option>
                  <option>Patia</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  className="form-control" 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required 
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }}>Save Address</button>
              </form>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#ef4444', fontStyle: 'italic' }}>No address added yet!</p>
            )}
          </div>

          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 'bold' }}>₹{total}</span>
          </div>
          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Delivery Fee</span>
            <span style={{ fontWeight: 'bold' }}>₹20</span>
          </div>
          
          <div className="summary-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--background)', fontSize: '1.4rem', fontWeight: '800' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{total + 20}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem', opacity: address ? 1 : 0.5, cursor: address ? 'pointer' : 'not-allowed' }}
            disabled={!address}
            onClick={() => alert('Order Placed Successfully!')}
          >
            {address ? 'Place Order' : 'Add Address to Continue'}
          </button>
          
          {!address && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>
              * Please add a delivery address to enable checkout.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
