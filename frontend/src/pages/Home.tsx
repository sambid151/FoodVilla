import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
            📍 <strong>Near Amrita Shopping Arcade, Bhubaneswar</strong><br/>
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
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Straight from Berhampur to your plate in Bhubaneswar</p>
        </div>
        
        <div className="grid">
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-img-wrapper">
              <img src="/idli.png" alt="Idli" className="card-img" />
            </div>
            <div className="card-content">
              <h3>Soft Idli & Vada</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Served with authentic sambar and coconut chutney.</p>
              <Link to="/menu" className="btn btn-outline" style={{width: '100%'}}>Order Now</Link>
            </div>
          </div>
          <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-img-wrapper">
              <img src="/dosa.jpg" alt="Dosa" className="card-img" />
            </div>
            <div className="card-content">
              <h3>Crispy Dosa & Uttapam</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>The Berhampur special crispy Dosa varieties.</p>
              <Link to="/menu" className="btn btn-outline" style={{width: '100%'}}>Order Now</Link>
            </div>
          </div>
          <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-img-wrapper">
              <img src="/puri.png" alt="Puri" className="card-img" />
            </div>
            <div className="card-content">
              <h3>Puri Sabji</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Fluffy puris with our special spicy sabji.</p>
              <Link to="/menu" className="btn btn-outline" style={{width: '100%'}}>Order Now</Link>
            </div>
          </div>
          <div className="card fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="card-img-wrapper">
              <img src="/chakuli.png" alt="Chakuli" className="card-img" />
            </div>
            <div className="card-content">
              <h3>Chakuli Pitha & Ghuguni</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Traditional Odia thin pancakes served with spicy Ghuguni.</p>
              <Link to="/menu" className="btn btn-outline" style={{width: '100%'}}>Order Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
