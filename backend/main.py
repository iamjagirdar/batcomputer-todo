# ============================================================
#  Batcomputer Todo API  — v4 with JWT Auth + In-Memory Storage
# ============================================================

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
import uuid

# ── Security ──────────────────────────────────────────────────
SECRET_KEY         = "batcomputer-gotham-2024-ultra-secret-key-xK9mP2nQ"
ALGORITHM          = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7   # 7 days

pwd_context   = None  # not used — using bcrypt directly
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ── In-memory storage ─────────────────────────────────────────
users_db: dict       = {}   # { email: user_dict }
todos:    List[dict] = []   # [ todo_dict, ... ]

# ── App ───────────────────────────────────────────────────────
app = FastAPI(title="Batcomputer API", version="4.0.0")

# CORS headers on ALL responses including errors
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    return response

# Handle preflight OPTIONS requests
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return add_cors_headers(JSONResponse(content={}, status_code=200))
    response = await call_next(request)
    return add_cors_headers(response)

# CRITICAL: Also add CORS to HTTPException responses
# Without this, 401/400/422 errors block the browser
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return add_cors_headers(JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    ))

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return add_cors_headers(JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    ))


# ── Pydantic schemas ──────────────────────────────────────────

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

class TodoOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool
    user_id: str


# ── Auth helpers ──────────────────────────────────────────────

def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt(rounds=4)).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_token(email: str) -> str:
    exp = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": email, "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
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


# ── Routes ────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Batcomputer API v4 — running!"}

@app.get("/ping")
def ping():
    return {"status": "awake"}


# ── Auth ──────────────────────────────────────────────────────

@app.post("/auth/register", response_model=Token, status_code=201)
def register(data: UserRegister):
    if data.email.lower() in users_db:
        raise HTTPException(status_code=400, detail="Email already registered.")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    if len(data.username.strip()) < 2:
        raise HTTPException(status_code=400, detail="Username must be at least 2 characters.")

    user = {
        "id":              str(uuid.uuid4()),
        "username":        data.username.strip(),
        "email":           data.email.lower().strip(),
        "hashed_password": hash_password(data.password),
    }
    users_db[user["email"]] = user
    return {
        "access_token": create_token(user["email"]),
        "token_type":   "bearer",
        "user":         {"id": user["id"], "username": user["username"], "email": user["email"]},
    }


@app.post("/auth/login", response_model=Token)
def login(data: UserLogin):
    user = users_db.get(data.email.lower().strip())
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {
        "access_token": create_token(user["email"]),
        "token_type":   "bearer",
        "user":         {"id": user["id"], "username": user["username"], "email": user["email"]},
    }


@app.get("/auth/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


# ── Todos (protected) ─────────────────────────────────────────

@app.get("/todos", response_model=List[TodoOut])
def get_todos(current_user: dict = Depends(get_current_user)):
    return [t for t in todos if t["user_id"] == current_user["id"]]


@app.post("/todos", response_model=TodoOut, status_code=201)
def create_todo(data: TodoCreate, current_user: dict = Depends(get_current_user)):
    todo = {
        "id":          str(uuid.uuid4()),
        "title":       data.title,
        "description": data.description,
        "completed":   False,
        "user_id":     current_user["id"],
    }
    todos.append(todo)
    return todo


@app.put("/todos/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: str, data: TodoUpdate, current_user: dict = Depends(get_current_user)):
    for todo in todos:
        if todo["id"] == todo_id and todo["user_id"] == current_user["id"]:
            todo.update(data.model_dump(exclude_unset=True))
            return todo
    raise HTTPException(status_code=404, detail="Todo not found.")


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: str, current_user: dict = Depends(get_current_user)):
    global todos
    before = len(todos)
    todos = [t for t in todos if not (t["id"] == todo_id and t["user_id"] == current_user["id"])]
    if len(todos) == before:
        raise HTTPException(status_code=404, detail="Todo not found.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
