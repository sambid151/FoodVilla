import React from 'react';

interface MenuItemProps {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  is_available: boolean;
  onAddToCart: (id: number) => void;
}

const MenuCard: React.FC<MenuItemProps> = ({ id, name, price, image_url, category, is_available, onAddToCart }) => {
  // Using a highly reliable Pexels food image as fallback to avoid Unsplash rate limits
  const fallbackImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div className="card fade-in">
      <div className="card-img-wrapper">
        <img 
          src={image_url || fallbackImage} 
          alt={name} 
          className="card-img" 
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
            (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
          }}
        />
        {category === 'Combos' && (
          <div className="combo-badge">Best Value</div>
        )}
      </div>
      <div className="card-content">
        <div className="card-info">
          <div className="card-header">
            <h3 className="card-title">{name}</h3>
            <span className={`status-badge ${is_available ? 'status-available' : 'status-unavailable'}`}>
              {is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <p className="card-category">{category}</p>
        </div>
        <div className="card-footer">
          <p className="card-price">₹{price.toFixed(2)}</p>
          <button 
            className="btn btn-primary btn-add" 
            disabled={!is_available}
            onClick={() => onAddToCart(id)}
          >
            <span className="plus-icon">+</span> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
