import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from '../components/MenuCard';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Mock data for the demo if API is not running
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
        setItems(response.data);
        const uniqueCategories = Array.from(new Set(response.data.map((item: MenuItem) => item.category))) as string[];
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        setItems(mockItems);
        const uniqueCategories = Array.from(new Set(mockItems.map(item => item.category)));
        setCategories(['All', ...uniqueCategories]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (id: number) => {
    const token = localStorage.getItem('token');
    const itemDetails = items.find(i => i.id === id) || mockItems.find(i => i.id === id);
    
    if (!token) {
      if (itemDetails) {
        sessionStorage.setItem('pendingItem', JSON.stringify(itemDetails));
      }
      navigate('/auth');
      return;
    }

    if (itemDetails) {
      addToCart(itemDetails);
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="page-wrapper container" style={{ paddingBottom: '4rem' }}>
      <h1 style={{ margin: '2rem 0' }}>Our Menu</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading deliciousness...</div>
      ) : (
        <>
          <div className="categories">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid">
            {filteredItems.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <MenuCard 
                  {...item} 
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
