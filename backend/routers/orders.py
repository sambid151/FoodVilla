from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=schemas.Order)
def place_order(order_data: schemas.OrderCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get user's cart items
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Create new order
    new_order = models.Order(
        user_id=current_user.id,
        delivery_address=order_data.delivery_address,
        total_amount=order_data.total_amount
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Add order items and clear cart
    for cart_item in cart_items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            menu_item_id=cart_item.menu_item_id,
            quantity=cart_item.quantity,
            price_at_time=cart_item.menu_item.price
        )
        db.add(order_item)
        db.delete(cart_item) # Clear from cart

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/", response_model=List[schemas.Order])
def get_order_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.created_at.desc()).all()
    return orders
