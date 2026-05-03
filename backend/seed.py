from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_menu_items(db: Session):
    menu_items_data = [
        # Breakfast Items (Traditional Odia)
        {"name": "Bara Ghuguni", "category": "Breakfast Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1544256661-d7031daabf2e?auto=format&fit=crop&w=300&q=80"},
        {"name": "Idli Sambar (4 pieces)", "category": "Breakfast Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=300&q=80"},
        {"name": "Chakuli Pitha", "category": "Breakfast Items", "price": 25.0, "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80"},
        {"name": "Upma", "category": "Breakfast Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80"},
        {"name": "Chuda Ghuguni", "category": "Breakfast Items", "price": 35.0, "image_url": "https://images.unsplash.com/photo-1544256661-d7031daabf2e?auto=format&fit=crop&w=300&q=80"},
        {"name": "Suji Halwa", "category": "Breakfast Items", "price": 25.0, "image_url": "https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=300&q=80"},
        {"name": "Puri Sabji (4 pieces)", "category": "Breakfast Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=300&q=80"},
        
        # Fast Food Items
        {"name": "Veg Sandwich", "category": "Fast Food Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1550508426-11eb85a11c8a?auto=format&fit=crop&w=300&q=80"},
        {"name": "Bread Omelette", "category": "Fast Food Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1525999146200-a92c3000b080?auto=format&fit=crop&w=300&q=80"},
        {"name": "Aloo Paratha", "category": "Fast Food Items", "price": 35.0, "image_url": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80"},
        {"name": "Veg Burger", "category": "Fast Food Items", "price": 50.0, "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80"},
        {"name": "Egg Burger", "category": "Fast Food Items", "price": 60.0, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"},
        {"name": "Egg Roll", "category": "Fast Food Items", "price": 50.0, "image_url": "https://images.unsplash.com/photo-1626200924976-586b62bd93ec?auto=format&fit=crop&w=300&q=80"},
        {"name": "Veg Roll", "category": "Fast Food Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&q=80"},
        {"name": "Cheese Sandwich", "category": "Fast Food Items", "price": 45.0, "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80"},
        {"name": "Maggi (Plain)", "category": "Fast Food Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=300&q=80"},
        {"name": "Maggi (With Egg)", "category": "Fast Food Items", "price": 45.0, "image_url": "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?auto=format&fit=crop&w=300&q=80"},

        # Egg Items
        {"name": "Boiled Eggs (2 pieces)", "category": "Egg Items", "price": 20.0, "image_url": "https://images.unsplash.com/photo-1516685018646-54919852fd01?auto=format&fit=crop&w=300&q=80"},
        {"name": "Masala Omelette", "category": "Egg Items", "price": 30.0, "image_url": "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=300&q=80"},
        {"name": "Cheese Omelette", "category": "Egg Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=300&q=80"},
        {"name": "Egg Bhurji", "category": "Egg Items", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=300&q=80"},
        {"name": "Double Egg Omelette", "category": "Egg Items", "price": 50.0, "image_url": "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=300&q=80"},
        {"name": "Egg Toast", "category": "Egg Items", "price": 25.0, "image_url": "https://images.unsplash.com/photo-1525999146200-a92c3000b080?auto=format&fit=crop&w=300&q=80"},

        # Beverages
        {"name": "Tea", "category": "Beverages", "price": 15.0, "image_url": "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?auto=format&fit=crop&w=300&q=80"},
        {"name": "Coffee", "category": "Beverages", "price": 25.0, "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80"},
        {"name": "Lassi", "category": "Beverages", "price": 35.0, "image_url": "https://images.unsplash.com/photo-1626200419188-f56d462fd26b?auto=format&fit=crop&w=300&q=80"},
        {"name": "Fresh Juice", "category": "Beverages", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80"},
        {"name": "Badam Milk", "category": "Beverages", "price": 45.0, "image_url": "https://images.unsplash.com/photo-1550461716-ba4eea52070a?auto=format&fit=crop&w=300&q=80"},
        {"name": "Cold Drinks", "category": "Beverages", "price": 20.0, "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80"},

        # Combos
        {"name": "Idli + Tea", "category": "Combos", "price": 40.0, "image_url": "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=300&q=80"},
        {"name": "Bara Ghuguni + Tea", "category": "Combos", "price": 50.0, "image_url": "https://images.unsplash.com/photo-1544256661-d7031daabf2e?auto=format&fit=crop&w=300&q=80"},
        {"name": "Bread Omelette + Coffee", "category": "Combos", "price": 50.0, "image_url": "https://images.unsplash.com/photo-1525999146200-a92c3000b080?auto=format&fit=crop&w=300&q=80"}
    ]

    for item_data in menu_items_data:
        # Check if item exists to avoid duplicates if run multiple times
        existing = db.query(models.MenuItem).filter(models.MenuItem.name == item_data["name"]).first()
        if not existing:
            db_item = models.MenuItem(**item_data)
            db.add(db_item)
    
    db.commit()
    print("Database seeded with FoodVilla menu items.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_menu_items(db)
    finally:
        db.close()
