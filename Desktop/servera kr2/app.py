from fastapi import FastAPI, Cookie, Response, Request, HTTPException
from typing import Optional
from datetime import datetime
import uuid
import time

from itsdangerous import URLSafeSerializer, BadSignature
from models import UserCreate, CommonHeaders

app = FastAPI()

# Задание 3.1

@app.post("/create_user")
def create_user(user: UserCreate):
    return user


# Задание 3.2

sample_product_1 = {"product_id": 123, "name": "Smartphone",  "category": "Electronics",  "price": 599.99}
sample_product_2 = {"product_id": 456, "name": "Phone Case",  "category": "Accessories",  "price": 19.99}
sample_product_3 = {"product_id": 789, "name": "Iphone",       "category": "Electronics",  "price": 1299.99}
sample_product_4 = {"product_id": 101, "name": "Headphones",  "category": "Accessories",  "price": 99.99}
sample_product_5 = {"product_id": 202, "name": "Smartwatch",  "category": "Electronics",  "price": 299.99}

sample_products = [sample_product_1, sample_product_2, sample_product_3,
                   sample_product_4, sample_product_5]


@app.get("/products/search")
def search_products(
    keyword: str,
    category: Optional[str] = None,
    limit: int = 10,
):
    results = [
        p for p in sample_products
        if keyword.lower() in p["name"].lower()
    ]
    if category:
        results = [p for p in results if p["category"].lower() == category.lower()]
    return results[:limit]


@app.get("/product/{product_id}")
def get_product(product_id: int):
    for p in sample_products:
        if p["product_id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="Product not found")


# Задание 5.1

FAKE_USERS = {
    "user123": {"password": "password123", "name": "User One", "email": "user1@example.com"},
    "admin":   {"password": "admin123",    "name": "Admin",    "email": "admin@example.com"},
}

# хранилище session_token -> username  (задание 5.1)
sessions_51: dict[str, str] = {}


class LoginData51:
    pass

from pydantic import BaseModel

class LoginBody(BaseModel):
    username: str
    password: str


@app.post("/login")
def login(body: LoginBody, response: Response):
    user = FAKE_USERS.get(body.username)
    if not user or user["password"] != body.password:
        response.status_code = 401
        return {"message": "Invalid credentials"}

    token = str(uuid.uuid4())
    sessions_51[token] = body.username
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        max_age=3600,
    )
    return {"message": "Logged in successfully"}


@app.get("/user")
def get_user_profile(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if not session_token or session_token not in sessions_51:
        response.status_code = 401
        return {"message": "Unauthorized"}
    username = sessions_51[session_token]
    user = FAKE_USERS[username]
    return {"username": username, "name": user["name"], "email": user["email"]}


# Задание 5.2
SECRET_KEY = "super-secret-key-change-in-prod"
signer = URLSafeSerializer(SECRET_KEY)

# user_id (UUID) -> username
user_registry: dict[str, str] = {}


@app.post("/login/signed")
def login_signed(body: LoginBody, response: Response):
    user = FAKE_USERS.get(body.username)
    if not user or user["password"] != body.password:
        response.status_code = 401
        return {"message": "Invalid credentials"}

    user_id = str(uuid.uuid4())
    user_registry[user_id] = body.username

    signed_token = signer.dumps(user_id)

    response.set_cookie(
        key="session_token",
        value=signed_token,
        httponly=True,
        max_age=3600,
    )
    return {"message": "Logged in with signed cookie"}


@app.get("/profile")
def get_profile(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if not session_token:
        response.status_code = 401
        return {"message": "Unauthorized"}
    try:
        user_id = signer.loads(session_token)
    except BadSignature:
        response.status_code = 401
        return {"message": "Unauthorized"}

    username = user_registry.get(user_id)
    if not username:
        response.status_code = 401
        return {"message": "Unauthorized"}

    user = FAKE_USERS[username]
    return {"user_id": user_id, "username": username, "name": user["name"], "email": user["email"]}


# Задание 5.3

SESSION_LIFETIME = 300   # 5 минут
SESSION_RENEW_AFTER = 180  # 3 минуты

signer53 = URLSafeSerializer(SECRET_KEY + "-v53")
user_registry53: dict[str, str] = {}


def make_session_token(user_id: str) -> str:
    ts = int(time.time())
    payload = f"{user_id}.{ts}"
    signature = signer53.dumps(payload)
    return signature


def parse_session_token(token: str):
    """Возвращает (user_id, timestamp) или бросает исключение."""
    try:
        payload = signer53.loads(token)
    except BadSignature:
        raise ValueError("invalid")
    parts = payload.split(".")
    if len(parts) != 2:
        raise ValueError("invalid")
    user_id, ts_str = parts
    return user_id, int(ts_str)


@app.post("/login/v3")
def login_v3(body: LoginBody, response: Response):
    user = FAKE_USERS.get(body.username)
    if not user or user["password"] != body.password:
        response.status_code = 401
        return {"message": "Invalid credentials"}

    user_id = str(uuid.uuid4())
    user_registry53[user_id] = body.username

    token = make_session_token(user_id)
    response.set_cookie(key="session_token", value=token, httponly=True,
                        secure=False, max_age=SESSION_LIFETIME)
    return {"message": "Logged in (v3)"}


@app.get("/profile/v3")
def profile_v3(response: Response, session_token: Optional[str] = Cookie(default=None)):
    if not session_token:
        response.status_code = 401
        return {"message": "Session expired"}

    try:
        user_id, last_active = parse_session_token(session_token)
    except ValueError:
        response.status_code = 401
        return {"message": "Invalid session"}

    now = int(time.time())
    elapsed = now - last_active

    if elapsed >= SESSION_LIFETIME:
        response.status_code = 401
        return {"message": "Session expired"}

    username = user_registry53.get(user_id)
    if not username:
        response.status_code = 401
        return {"message": "Invalid session"}

    if SESSION_RENEW_AFTER <= elapsed < SESSION_LIFETIME:
        new_token = make_session_token(user_id)
        response.set_cookie(key="session_token", value=new_token, httponly=True,
                            secure=False, max_age=SESSION_LIFETIME)

    user = FAKE_USERS[username]
    return {"user_id": user_id, "username": username, "name": user["name"], "email": user["email"]}



# Задание 5.4

@app.get("/headers")
def get_headers(request: Request):
    user_agent = request.headers.get("user-agent")
    accept_language = request.headers.get("accept-language")

    if not user_agent:
        raise HTTPException(status_code=400, detail="Missing User-Agent header")
    if not accept_language:
        raise HTTPException(status_code=400, detail="Missing Accept-Language header")

    return {
        "User-Agent": user_agent,
        "Accept-Language": accept_language,
    }



# Задание 5.5

from fastapi import Depends

def get_common_headers(request: Request) -> CommonHeaders:
    try:
        return CommonHeaders(**{
            "user-agent": request.headers.get("user-agent", ""),
            "accept-language": request.headers.get("accept-language", ""),
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/headers/v2")
def get_headers_v2(headers: CommonHeaders = Depends(get_common_headers)):
    return {
        "User-Agent": headers.user_agent,
        "Accept-Language": headers.accept_language,
    }


@app.get("/info")
def get_info(response: Response, headers: CommonHeaders = Depends(get_common_headers)):
    response.headers["X-Server-Time"] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    return {
        "message": "Добро пожаловать! Ваши заголовки успешно обработаны.",
        "headers": {
            "User-Agent": headers.user_agent,
            "Accept-Language": headers.accept_language,
        },
    }
