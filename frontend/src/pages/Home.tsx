import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu');
        const filtered = response.data.filter((item: any) => item.is_specialty);
        setSpecialties(filtered);
      } catch (error) {
        console.error("Failed to fetch specialties", error);
      }
    };
    fetchSpecialties();
  }, []);

  const handleAddToCart = (item: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      sessionStorage.setItem('pendingItem', JSON.stringify(item));
      navigate('/auth');
      return;
    }
    addToCart(item);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <section className="hero container" style={{ flex: 1 }}>
        <div className="hero-blob" style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--secondary))', opacity: 0.3 }}></div>

        <div className="hero-content fade-in">
          <span className="hero-badge" style={{ background: 'var(--accent-green)', color: 'white' }}>Authentic Berhampur Tiffin Center</span>
          <h1 className="hero-title" style={{ fontSize: 'calc(2.5rem + 1.5vw)' }}>The Shree Food Villa</h1>
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
            Traditional breakfast flavors served fresh at <strong>CRPF Square</strong>.
            Enjoy our famous Dosa, Idli, and Puri Sabji made with love.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 'bold' }}>
              🌿 NO PALM OIL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 'bold' }}>
              🚫 NO MSG
            </div>
          </div>

          <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem' }}>
            📍 <strong>Near Amrita Shopping Arcade, Bhubaneswar</strong><br />
            ⏰ <strong>OPEN DAILY: 7 AM TO 11 AM</strong>
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/menu" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Order Now</Link>
            <a href="#popular" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>View Menu</a>
          </div>
        </div>

        <div className="hero-image-wrapper fade-in" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="/idli.png"
            alt="Delicious Tiffin"
            style={{ width: '100%', maxWidth: '500px', borderRadius: '30px', boxShadow: 'var(--shadow-lg)', transform: 'rotate(2deg)' }}
          />
        </div>
      </section>

      <section id="popular" className="container" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Our Tiffin Specialties</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Bringing the spicy soul of Berhampur to the heart of Bhubaneswar.</p>
        </div>

        <div className="grid">
          {specialties.length > 0 ? specialties.map((item: any, index: number) => (
            <div key={item.id} className="card fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              <div className="card-img-wrapper">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="card-img" 
                  onError={(e) => {
                    e.currentTarget.src = '/idli.png';
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
              <div className="card-content" style={{ height: 'auto', minHeight: '200px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem', flex: 1 }}>{item.description || 'Authentic flavor from Berhampur.'}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #fef08a', paddingTop: '1rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{item.price}</span>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleAddToCart(item)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-light)' }}>
              Loading our favorites...
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
