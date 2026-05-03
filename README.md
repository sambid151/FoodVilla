# FoodVilla

FoodVilla is a full-stack food ordering application. It features a modern, responsive frontend built with React and Vite, and a robust backend powered by FastAPI and SQLAlchemy. 

## 🚀 Features

- **User Authentication**: Secure login and signup flows using JWT.
- **Menu Display**: Browse available food items.
- **Cart Management**: Add items to the cart, adjust quantities, and manage orders.
- **Responsive Design**: Optimized for different screen sizes.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Database ORM**: SQLAlchemy
- **Data Validation**: Pydantic
- **Authentication**: Passlib (Bcrypt) & Python-JOSE (JWT)
- **Server**: Uvicorn

## 📁 Project Structure

```
foodvilla/
├── backend/            # FastAPI backend application
│   ├── main.py         # Entry point for the backend server
│   ├── models.py       # Database models
│   ├── schemas.py      # Pydantic schemas for data validation
│   ├── database.py     # Database connection setup
│   ├── routers/        # API route handlers (auth, menu, cart, etc.)
│   └── seed.py         # Database seeding script
└── frontend/           # React frontend application
    ├── src/            # Source code (components, pages, services)
    ├── public/         # Static assets
    ├── package.json    # Frontend dependencies
    └── vite.config.ts  # Vite configuration
```

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the database seed script to populate initial data (if applicable):
   ```bash
   python seed.py
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`.

## 🔮 Future Enhancements & Roadmap

This project is actively being developed. As new enhancements happen, this section and the project structure will be updated.

- [ ] **Payment Gateway Integration**: Allow users to securely pay for their orders.
- [ ] **Order History & Tracking**: Let users see their past orders and track current ones.
- [ ] **Admin Dashboard**: A dedicated panel for restaurant owners to manage menu items, view orders, and analyze sales.
- [ ] **User Profiles**: Allow users to save delivery addresses and favorite items.
- [ ] **Reviews & Ratings**: Enable customers to leave reviews for food items.

---

*Note: This README is structured to be easily updatable as the project evolves.*
