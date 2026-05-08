import sqlite3
import os

db_path = "foodvilla.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE menu_items ADD COLUMN description TEXT;")
        print("Added description column")
    except sqlite3.OperationalError:
        print("description column already exists")
    
    try:
        cursor.execute("ALTER TABLE menu_items ADD COLUMN is_specialty BOOLEAN DEFAULT 0;")
        print("Added is_specialty column")
    except sqlite3.OperationalError:
        print("is_specialty column already exists")
    
    conn.commit()
    conn.close()
else:
    print("Database file not found")
