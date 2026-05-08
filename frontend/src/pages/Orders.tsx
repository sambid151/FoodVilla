import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: number;
  quantity: number;
  price_at_time: number;
  menu_item: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: number;
  total_amount: number;
  delivery_address: string;
  status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate]);

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '4rem' }}>
      <h1 style={{ margin: '2rem 0' }}>Order History</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>You haven't placed any orders yet.</h3>
          <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{marginTop: '1rem'}}>Browse Menu</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>Order #{order.id}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${order.status === 'Pending' ? 'status-unavailable' : 'status-available'}`}>
                    {order.status}
                  </span>
                  <h3 style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>₹{order.total_amount.toFixed(2)}</h3>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={item.menu_item.image_url} 
                        alt={item.menu_item.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100';
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <span>{item.quantity}x {item.menu_item.name}</span>
                    </div>
                    <span>₹{(item.price_at_time * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p><strong>Delivery to:</strong> {order.delivery_address}</p>
                <p><span style={{background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600'}}>💳 {order.payment_method}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
