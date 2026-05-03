import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '2px solid var(--accent-green)',
      padding: '3rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>The Shree Food Villa</span>
          </h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            Authentic Berhampur Tiffin Center<br/>
            NO PALM OIL • NO MSG
          </p>
          <div style={{ display: 'inline-block', background: 'var(--secondary)', color: 'var(--primary-hover)', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            🎉 Party Orders Accepted Here
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem' }}>Contact Us</h4>
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <strong>📞 Phone:</strong> +91 79788 36641
          </p>
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <strong>📱 Instagram:</strong> <a href="https://instagram.com/shreethefoodvilla24" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>@shreethefoodvilla24</a>
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem' }}>Location & Hours</h4>
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            <strong>📍 Location:</strong><br/>
            CRPF Square, Near Amrita Shopping Arcade,<br/>
            Bhubaneswar, Odisha
          </p>
          <p style={{ color: 'var(--text-main)' }}>
            <strong>⏰ Timings:</strong><br/>
            Open Daily: 7 AM to 11 AM
          </p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} The Shree Food Villa. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
