import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const { cartCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          The Shree Food Villa
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.4rem 1rem'}}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-outline" style={{padding: '0.4rem 1rem'}}>Login</Link>
          )}
          
          <Link to="/cart" className="btn btn-primary" style={{padding: '0.4rem 1rem'}}>
            🛒 Cart <span style={{background: 'white', color: 'var(--primary)', padding: '2px 8px', borderRadius: '20px', marginLeft: '5px', fontSize: '0.8rem'}}>{cartCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
