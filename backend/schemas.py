from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str

# --- Token Schema ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None

# --- MenuItem Schemas ---
class MenuItemBase(BaseModel):
    name: str
    category: str
    price: float
    image_url: Optional[str] = None
    is_available: bool = True

class MenuItem(MenuItemBase):
    id: int

    class Config:
        from_attributes = True

# --- CartItem Schemas ---
class CartItemBase(BaseModel):
    menu_item_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    user_id: int
    menu_item: MenuItem

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int
    price_at_time: float

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    menu_item: MenuItem

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    delivery_address: str
    total_amount: float

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    status: str
    created_at: datetime.datetime
    items: List[OrderItem] = []

    class Config:
        from_attributes = True
