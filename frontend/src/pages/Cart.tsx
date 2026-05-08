import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, cartCount, address, saveAddress, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [upiId, setUpiId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    street: address?.street || '',
    area: address?.area || 'CRPF Square',
    phone: address?.phone || ''
  });
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success', callback?: () => void) => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg('');
      if (callback) callback();
    }, 2500);
  };

  const total = cart.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.street.trim() || !formData.phone.trim()) {
      showToast('Please fill all the mandatory address fields.', 'error');
      return;
    }
    
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }

    saveAddress(formData);
    setShowAddressForm(false);
  };

  const handleProceedToPayment = () => {
    if (!address) {
      showToast('Please add a delivery address to continue', 'error');
      setShowAddressForm(true);
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      showToast('Please add a delivery address', 'error');
      return;
    }
    
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      showToast('Please enter a valid UPI ID', 'error');
      return;
    }

    setIsPlacingOrder(true);
    const token = localStorage.getItem('token');
    
    try {
      await axios.post('http://localhost:8000/orders', {
        delivery_address: `${address.fullName}, ${address.street}, ${address.area}`,
        total_amount: total + 20,
        payment_method: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowSuccess(true);
      clearCart();
    } catch (error) {
      console.error(error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccess && countdown === 0) {
      navigate('/orders');
    }
    return () => clearTimeout(timer);
  }, [showSuccess, countdown, navigate]);

  useEffect(() => {
    const shouldAdd = sessionStorage.getItem('shouldAddPendingItem');
    const pendingItemStr = sessionStorage.getItem('pendingItem');
    
    if (shouldAdd === 'true' && pendingItemStr) {
      try {
        const item = JSON.parse(pendingItemStr);
        addToCart(item);
        showToast(`Added ${item.name} to your cart!`, 'success');
        sessionStorage.removeItem('shouldAddPendingItem');
        sessionStorage.removeItem('pendingItem');
      } catch (e) {
        console.error("Failed to add pending item", e);
      }
    }
  }, [addToCart]);

  if (cart.length === 0 && !showSuccess) {
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
      <h1 style={{ margin: '2rem 0' }}>{checkoutStep === 'address' ? 'Your Shopping Cart' : 'Select Payment Method'} ({cartCount} items)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
        <div className="cart-items">
          {checkoutStep === 'address' ? (
            cart.map((item) => (
              <div key={item.id} className="cart-item fade-in">
                <img 
                  src={item.menu_item.image_url} 
                  alt={item.menu_item.name} 
                  className="cart-item-img" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100';
                    e.currentTarget.onerror = null;
                  }}
                />
                <div className="cart-item-info">
                  <h3 style={{fontSize: '1.1rem'}}>{item.menu_item.name}</h3>
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
            ))
          ) : (
            <div className="payment-section fade-in">
              <div 
                className={`payment-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
              >
                <div className="payment-icon">📱</div>
                <div className="payment-info">
                  <h4>UPI (Google Pay, PhonePe, Paytm)</h4>
                  <p>Pay instantly using your preferred UPI app</p>
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="fade-in" style={{marginTop: '1rem', paddingLeft: '1rem'}}>
                  <input 
                    type="text" 
                    placeholder="Enter your UPI ID (e.g. user@okaxis)" 
                    className="form-control"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{maxWidth: '300px'}}
                  />
                </div>
              )}

              <div 
                className={`payment-card ${paymentMethod === 'COD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('COD')}
                style={{marginTop: '1rem'}}
              >
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <h4>Cash on Delivery</h4>
                  <p>Pay in cash when your tiffin arrives</p>
                </div>
              </div>

              <button 
                onClick={() => setCheckoutStep('address')}
                style={{marginTop: '2rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                ← Back to Order Summary
              </button>
            </div>
          )}
        </div>

        <div className="cart-summary fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-main)', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Order Summary</h3>
          
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--background)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>📍 Delivery Address</strong>
              {checkoutStep === 'address' && (
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {address ? 'Change' : 'Add'}
                </button>
              )}
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

          {checkoutStep === 'address' ? (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}
              onClick={handleProceedToPayment}
            >
              {address ? 'Proceed to Payment' : 'Add Address to Continue'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem', position: 'relative' }}
              disabled={isPlacingOrder}
              onClick={handlePlaceOrder}
            >
              {isPlacingOrder ? <span className="spinner"></span> : `Pay ₹${total + 20}`}
            </button>
          )}
          
          {!address && checkoutStep === 'address' && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>
              * Please add a delivery address to enable checkout.
            </p>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <div className={`success-overlay ${showSuccess ? 'show' : ''}`}>
        <div className="success-content">
          <div className="checkmark-circle">✓</div>
          <h1 className="success-title">Order Placed!</h1>
          <p className="success-message">
            Hurray! Your delicious tiffin is being prepared.<br/>
            Redirecting to your orders in {countdown} seconds...
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>Go to My Orders</button>
            <button className="btn btn-outline" onClick={() => navigate('/menu')}>Order More</button>
          </div>
          
          {/* Confetti Elements */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                background: ['#f97316', '#ef4444', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      </div>

      <div className={`toast-popup ${toastMsg ? 'show' : ''} ${toastType === 'success' ? 'toast-success' : 'toast-error'}`}>
        <div className="toast-icon">{toastType === 'success' ? '✓' : '✕'}</div>
        <div className="toast-message">{toastMsg}</div>
      </div>
    </div>
  );
};

export default Cart;
