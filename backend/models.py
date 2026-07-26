# ============================================================
#  models.py — Database Table Definitions
# ============================================================
#
# Each class here = one table in the database.
# Each attribute = one column in that table.
# ============================================================

from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import uuid

def gen_uuid():
    return str(uuid.uuid4())

# ── Users table ───────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id              = Column(String, primary_key=True, default=gen_uuid)
    username        = Column(String, nullable=False)
    email           = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at      = Column(DateTime, default=datetime.utcnow)

    # Relationship — one user has many todos
    # cascade="all, delete" means deleting a user deletes their todos too
    todos = relationship("Todo", back_populates="owner", cascade="all, delete")


# ── Todos table ───────────────────────────────────────────────
class Todo(Base):
    __tablename__ = "todos"

    id          = Column(String, primary_key=True, default=gen_uuid)
    title       = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed   = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.utcnow)

    # Foreign key — links each todo to a user
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationship — back reference to the User
    owner = relationship("User", back_populates="todos")
