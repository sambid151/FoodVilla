import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const { cartCount, addToCart } = useCart();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [results, setResults] = useState<MenuItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fallback mock data in case API is down
  const mockItems: MenuItem[] = [
    {"id":1, "name": "Bara Ghuguni", "category": "Breakfast Items", "price": 40.0, "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Bara_and_Ghuguni.JPG", is_available: true},
    {"id":2, "name": "Idli Sambar (4 pieces)", "category": "Breakfast Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=400&q=80", is_available: true},
    {"id":7, "name": "Idly (1 Plate)", "category": "Breakfast Items", "price": 20.0, "image_url": "https://images.unsplash.com/photo-1626082895617-2c6bf34483ae?auto=format&fit=crop&w=400&q=80", is_available: true},
    {"id":3, "name": "Dosa", "category": "Breakfast Items", "price": 50.0, "image_url": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_and_chutney.jpg", is_available: true},
    {"id":4, "name": "Chakuli Pitha", "category": "Breakfast Items", "price": 25.0, "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Chakuli_pitha.jpg", is_available: true},
    {"id":5, "name": "Upma", "category": "Breakfast Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80", is_available: true},
    {"id":6, "name": "Masala Omelette", "category": "Egg Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=400&q=80", is_available: true},
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu');
        setMenuItems(response.data);
      } catch (error) {
        setMenuItems(mockItems);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 3) {
      const lowercasedValue = value.toLowerCase();
      // First try exact match
      const exactMatches = menuItems.filter(item => 
        item.name.toLowerCase() === lowercasedValue
      );
      
      if (exactMatches.length > 0) {
        setResults(exactMatches);
      } else {
        // Fuzzy match
        const fuzzyMatches = menuItems.filter(item => 
          item.name.toLowerCase().includes(lowercasedValue) || 
          item.category.toLowerCase().includes(lowercasedValue)
        );
        setResults(fuzzyMatches);
      }
      setIsDropdownOpen(true);
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          The Shree Food Villa
        </Link>
        <div className="nav-links">
          
          <div className="search-container" ref={searchRef}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for food..." 
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => { if (searchTerm.length >= 3) setIsDropdownOpen(true); }}
            />
            
            {isDropdownOpen && (
              <div className="search-dropdown">
                {results.length > 0 ? (
                  results.map((item) => (
                    <div key={item.id} className="search-result-item">
                      <img 
                        src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'} 
                        alt={item.name} 
                        className="search-result-img"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100';
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <div className="search-result-info">
                        <div className="search-result-name">{item.name}</div>
                        <div className="search-result-price">₹{item.price.toFixed(2)}</div>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        style={{padding: '0.3rem 0.6rem', fontSize: '0.8rem'}}
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.is_available}
                      >
                        {item.is_available ? 'Add' : 'Out'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="search-empty">No food found matching "{searchTerm}"</div>
                )}
              </div>
            )}
          </div>

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
