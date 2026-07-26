# ============================================================
#  Batcomputer Todo API  — v3 with SQLite + JWT Auth
# ============================================================

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

# Local modules
from database import engine, Base, get_db
import models

# ── Create all tables on startup ──────────────────────────────
# This reads all models and creates their tables if they don't exist yet.
# Safe to run multiple times — it won't overwrite existing data.
Base.metadata.create_all(bind=engine)

# ── Security ──────────────────────────────────────────────────
SECRET_KEY          = "batcomputer-gotham-2024-ultra-secret-key-xK9mP2nQ"
ALGORITHM           = "HS256"
TOKEN_EXPIRE_HOURS  = 24 * 7  # 7 days

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=4)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ── CORS ──────────────────────────────────────────────────────
app = FastAPI(title="Batcomputer API", version="3.0.0")

# Handle CORS manually — most reliable approach
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content={}, status_code=200)
    else:
        response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    return response


# ── Pydantic schemas (request/response shapes) ────────────────

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TodoOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool
    user_id: str
    class Config:
        from_attributes = True


# ── Auth helpers ──────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """Validate JWT and return the current User object from DB."""
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expired. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise exc
    except JWTError:
        raise exc

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise exc
    return user


# ── Routes ────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Batcomputer API v3 with SQLite — /docs"}

@app.get("/ping")
def ping():
    """Wake-up endpoint for Render free tier"""
    return {"status": "awake"}


# ── Auth ──────────────────────────────────────────────────────

@app.post("/auth/register", response_model=Token, status_code=201)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register new user, auto-login by returning token"""
    # Check duplicate email
    if db.query(models.User).filter(models.User.email == data.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email already registered.")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    if len(data.username.strip()) < 2:
        raise HTTPException(status_code=400, detail="Username must be at least 2 characters.")

    user = models.User(
        id=str(__import__('uuid').uuid4()),
        username=data.username.strip(),
        email=data.email.lower().strip(),
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": create_token(user.email),
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "email": user.email},
    }


@app.post("/auth/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Login with email + password"""
    user = db.query(models.User).filter(models.User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {
        "access_token": create_token(user.email),
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "email": user.email},
    }


@app.get("/auth/me", response_model=UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ── Todos (protected) ─────────────────────────────────────────

@app.get("/todos", response_model=List[TodoOut])
def get_todos(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Todo).filter(models.Todo.user_id == current_user.id).all()


@app.post("/todos", response_model=TodoOut, status_code=201)
def create_todo(
    todo_data: TodoCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = models.Todo(
        id=str(__import__('uuid').uuid4()),
        title=todo_data.title,
        description=todo_data.description,
        completed=False,
        user_id=current_user.id,
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.put("/todos/{todo_id}", response_model=TodoOut)
def update_todo(
    todo_id: str,
    update_data: TodoUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found.")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(todo, field, value)
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(
    todo_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.user_id == current_user.id
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found.")
    db.delete(todo)
    db.commit()
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
