from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/", response_model=List[schemas.CartItem])
def get_cart(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    return cart_items

@router.post("/", response_model=schemas.CartItem)
def add_to_cart(item: schemas.CartItemCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if item exists
    menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item.menu_item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    # Check if item already in cart
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == current_user.id,
        models.CartItem.menu_item_id == item.menu_item_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    new_cart_item = models.CartItem(
        user_id=current_user.id,
        menu_item_id=item.menu_item_id,
        quantity=item.quantity
    )
    db.add(new_cart_item)
    db.commit()
    db.refresh(new_cart_item)
    return new_cart_item

@router.put("/{item_id}", response_model=schemas.CartItem)
def update_cart_item(item_id: int, update_data: schemas.CartItemUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = update_data.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}
