import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from '../components/MenuCard';

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

  // Mock data for the demo if API is not running
  const mockItems: MenuItem[] = [
    {"id":1, "name": "Bara Ghuguni", "category": "Breakfast Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1544256661-d7031daabf2e?auto=format&fit=crop&w=300&q=80", is_available: true},
    {"id":2, "name": "Idli Sambar", "category": "Breakfast Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=300&q=80", is_available: true},
    {"id":3, "name": "Veg Burger", "category": "Fast Food Items", "price": 50.0, "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80", is_available: true},
    {"id":4, "name": "Masala Omelette", "category": "Egg Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=300&q=80", is_available: true},
    {"id":5, "name": "Badam Milk", "category": "Beverages", "price": 45.0, "image_url": "https://images.unsplash.com/photo-1550461716-ba4eea52070a?auto=format&fit=crop&w=300&q=80", is_available: true},
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:8000/menu');
        setItems(response.data);
        const uniqueCategories = Array.from(new Set(response.data.map((item: MenuItem) => item.category))) as string[];
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching menu, falling back to mock data", error);
        setItems(mockItems);
        const uniqueCategories = Array.from(new Set(mockItems.map(item => item.category)));
        setCategories(['All', ...uniqueCategories]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add items to cart");
      // Phase 3: Save item for persistence after login
      const pendingItems = JSON.parse(localStorage.getItem('pendingCartItems') || '[]');
      pendingItems.push({ menu_item_id: id, quantity: 1 });
      localStorage.setItem('pendingCartItems', JSON.stringify(pendingItems));
      window.location.href = '/auth';
      return;
    }
    try {
      await axios.post('http://localhost:8000/cart', { menu_item_id: id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Added to cart!");
    } catch (error) {
      console.warn("Backend API not reachable. Using mock cart.");
      const mockCart = JSON.parse(localStorage.getItem(`mockCart_${token}`) || '[]');
      const itemExists = mockCart.find((i: any) => i.menu_item_id === id);
      if (itemExists) {
        itemExists.quantity += 1;
      } else {
        const itemDetails = items.find(i => i.id === id) || mockItems.find(i => i.id === id);
        mockCart.push({ id: Date.now(), menu_item_id: id, quantity: 1, menu_item: itemDetails });
      }
      localStorage.setItem(`mockCart_${token}`, JSON.stringify(mockCart));
      alert("Added to cart!");
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
