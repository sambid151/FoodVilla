from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/menu", tags=["menu"])

@router.get("/", response_model=List[schemas.MenuItem])
def get_menu(db: Session = Depends(get_db)):
    items = db.query(models.MenuItem).all()
    return items

@router.get("/{category}", response_model=List[schemas.MenuItem])
def get_menu_by_category(category: str, db: Session = Depends(get_db)):
    items = db.query(models.MenuItem).filter(models.MenuItem.category == category).all()
    return items
