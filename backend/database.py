# ============================================================
#  database.py — SQLAlchemy Database Setup
# ============================================================
#
# SQLAlchemy is the most popular Python ORM (Object-Relational Mapper).
# ORM = lets you work with database rows as Python objects.
#
# Instead of writing raw SQL:
#   SELECT * FROM todos WHERE user_id = '123'
#
# You write Python:
#   db.query(Todo).filter(Todo.user_id == '123').all()
#
# SQLite = a file-based database. No server needed.
# The entire database lives in a single file: batcomputer.db
# ============================================================

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ── Database URL ──────────────────────────────────────────────
# sqlite:///./batcomputer.db means:
#   - Use SQLite
#   - Store the file as "batcomputer.db" in the current directory
DATABASE_URL = "sqlite:///./batcomputer.db"

# ── Engine ────────────────────────────────────────────────────
# The engine is the connection to the database.
# connect_args={"check_same_thread": False} is required for SQLite
# because FastAPI runs requests in multiple threads.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# ── Session factory ───────────────────────────────────────────
# Each request gets its own database session (connection).
# autocommit=False means we manually commit transactions.
# autoflush=False means changes aren't sent to DB until we commit.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Base class ────────────────────────────────────────────────
# All our database models (tables) inherit from this Base class.
# It keeps track of all models so we can create tables automatically.
Base = declarative_base()


# ── Dependency ────────────────────────────────────────────────
# This function is used as a FastAPI dependency in route functions.
# It creates a session, yields it to the route, then closes it.
# The try/finally ensures the session is always closed, even on errors.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
