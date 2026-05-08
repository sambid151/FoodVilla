from backend.database import SessionLocal
from backend import models
from backend.routers.auth import pwd_context

def create_test_user():
    db = SessionLocal()
    # Check if user already exists
    user = db.query(models.User).filter(models.User.email == "test@example.com").first()
    if not user:
        hashed_password = pwd_context.hash("password123")
        new_user = models.User(
            name="Test User",
            email="test@example.com",
            phone="1234567890",
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        print("Test user created: test@example.com / password123")
    else:
        print("Test user already exists.")
    db.close()

if __name__ == "__main__":
    create_test_user()
