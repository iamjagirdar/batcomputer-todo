# ============================================================
#  Batcomputer Todo API  — v2 with JWT Authentication
# ============================================================

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid

# ── Security config ──────────────────────────────────────────
SECRET_KEY = "batcomputer-gotham-2024-ultra-secret-key-xK9mP2nQ"
ALGORITHM  = "HS256"
TOKEN_EXPIRE_HOURS = 24

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=4)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ── CORS ─────────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://frontend-five-phi-39.vercel.app",
    "https://*.vercel.app",
]

# ── App ───────────────────────────────────────────────────────
app = FastAPI(title="Batcomputer API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory storage ─────────────────────────────────────────
# { email: { id, username, email, hashed_password } }
users_db: dict = {}
todos: List[dict] = []


# ── Pydantic models ───────────────────────────────────────────

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

class Todo(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: str


# ── Auth helpers ──────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Extract + validate JWT — used as a dependency in protected routes."""
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
    user = users_db.get(email)
    if not user:
        raise exc
    return user


# ── Auth routes ───────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Batcomputer API v2 — /docs for interactive docs"}

@app.get("/ping")
def ping():
    """Lightweight wake-up endpoint — call this first to wake Render from sleep"""
    return {"status": "awake"}


@app.post("/auth/register", response_model=Token, status_code=201)
def register(data: UserRegister):
    """Register a new user. Auto-logs them in by returning a token."""
    if data.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered.")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    if len(data.username.strip()) < 2:
        raise HTTPException(status_code=400, detail="Username must be at least 2 characters.")

    user = {
        "id": str(uuid.uuid4()),
        "username": data.username.strip(),
        "email": data.email.lower().strip(),
        "hashed_password": hash_password(data.password),
    }
    users_db[user["email"]] = user
    token = create_token(user["email"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "username": user["username"], "email": user["email"]},
    }


@app.post("/auth/login", response_model=Token)
def login(data: UserLogin):
    """Login with email + password. Returns JWT token."""
    user = users_db.get(data.email.lower().strip())
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_token(user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "username": user["username"], "email": user["email"]},
    }


@app.get("/auth/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    """Return current user info from token."""
    return {"id": current_user["id"], "username": current_user["username"], "email": current_user["email"]}


# ── Todo routes (all protected) ───────────────────────────────

@app.get("/todos", response_model=List[Todo])
def get_todos(current_user: dict = Depends(get_current_user)):
    return [t for t in todos if t["user_id"] == current_user["id"]]


@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(todo_data: TodoCreate, current_user: dict = Depends(get_current_user)):
    new_todo = {
        "id": str(uuid.uuid4()),
        "title": todo_data.title,
        "description": todo_data.description,
        "completed": False,
        "user_id": current_user["id"],
    }
    todos.append(new_todo)
    return new_todo


@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, update_data: TodoUpdate, current_user: dict = Depends(get_current_user)):
    for todo in todos:
        if todo["id"] == todo_id and todo["user_id"] == current_user["id"]:
            todo.update(update_data.model_dump(exclude_unset=True))
            return todo
    raise HTTPException(status_code=404, detail="Todo not found.")


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: str, current_user: dict = Depends(get_current_user)):
    global todos
    before = len(todos)
    todos = [t for t in todos if not (t["id"] == todo_id and t["user_id"] == current_user["id"])]
    if len(todos) == before:
        raise HTTPException(status_code=404, detail="Todo not found.")
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
