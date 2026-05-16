# FastAPI КР №2 — Технологии разработки серверных приложений

## Установка и запуск

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

Документация: http://localhost:8000/docs

---

## Маршруты

| Метод | Путь              | Задание | Описание |
|-------|-------------------|---------|----------|
| POST  | `/create_user`    | 3.1     | Создание пользователя с валидацией (email, age > 0) |
| GET   | `/products/search`| 3.2     | Поиск товаров по keyword, category, limit |
| GET   | `/product/{id}`   | 3.2     | Получить товар по ID |
| POST  | `/login`          | 5.1     | Логин, выдаёт UUID cookie `session_token` |
| GET   | `/user`           | 5.1     | Профиль (требует cookie) |
| POST  | `/login/signed`   | 5.2     | Логин с подписанным cookie (itsdangerous) |
| GET   | `/profile`        | 5.2     | Профиль с проверкой подписи cookie |
| POST  | `/login/v3`       | 5.3     | Логин с динамической сессией (5 мин, продление через 3 мин) |
| GET   | `/profile/v3`     | 5.3     | Профиль с авто-продлением сессии |
| GET   | `/headers`        | 5.4     | Возвращает User-Agent и Accept-Language |
| GET   | `/headers/v2`     | 5.5     | Заголовки через модель CommonHeaders |
| GET   | `/info`           | 5.5     | Заголовки + message + X-Server-Time |

---

## Примеры запросов

### 3.1 — POST /create_user
```json
{ "name": "Alice", "email": "alice@example.com", "age": 30, "is_subscribed": true }
```

### 3.2 — GET /products/search
```
GET /products/search?keyword=phone&category=Electronics&limit=5
```

### 5.1 — Логин и профиль
```bash
# Логин
curl -c cookies.txt -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user123", "password": "password123"}'

# Профиль
curl -b cookies.txt http://localhost:8000/user
```

### 5.2 — Подписанный cookie
```bash
curl -c cookies.txt -X POST http://localhost:8000/login/signed \
  -H "Content-Type: application/json" \
  -d '{"username": "user123", "password": "password123"}'

curl -b cookies.txt http://localhost:8000/profile
```

### 5.3 — Динамическая сессия
```bash
curl -c cookies.txt -X POST http://localhost:8000/login/v3 \
  -H "Content-Type: application/json" \
  -d '{"username": "user123", "password": "password123"}'

curl -b cookies.txt http://localhost:8000/profile/v3
```
- Через < 3 мин — кука не обновляется
- Через 3–5 мин — кука обновляется (новые 5 минут)
- Через > 5 мин — 401 Session expired

### 5.4 — GET /headers
```bash
curl http://localhost:8000/headers \
  -H "User-Agent: Mozilla/5.0" \
  -H "Accept-Language: en-US,en;q=0.9"
```

### 5.5 — GET /info
```bash
curl http://localhost:8000/info \
  -H "User-Agent: Mozilla/5.0" \
  -H "Accept-Language: en-US,en;q=0.9"
```

---

## Учётные данные для тестирования

| Username | Password     |
|----------|--------------|
| user123  | password123  |
| admin    | admin123     |
