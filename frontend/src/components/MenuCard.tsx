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

const MenuCard: React.FC<MenuItemProps> = ({ id, name, price, image_url, is_available, onAddToCart }) => {
  return (
    <div className="card fade-in">
      <div className="card-img-wrapper">
        <img src={image_url} alt={name} className="card-img" />
      </div>
      <div className="card-content">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <h3 className="card-title">{name}</h3>
          <span className={`status-badge ${is_available ? 'status-available' : 'status-unavailable'}`}>
            {is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <p className="card-price">₹{price.toFixed(2)}</p>
        <button 
          className="btn btn-primary" 
          style={{width: '100%'}}
          disabled={!is_available}
          onClick={() => onAddToCart(id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
