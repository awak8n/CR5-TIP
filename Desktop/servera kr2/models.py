from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
import re


# Задание 3.1
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = Field(default=None, gt=0)
    is_subscribed: Optional[bool] = None


# Задание 5.5
class CommonHeaders(BaseModel):
    user_agent: str = Field(alias="user-agent")
    accept_language: str = Field(alias="accept-language")

    model_config = {"populate_by_name": True}

    @field_validator("accept_language")
    @classmethod
    def validate_accept_language(cls, v: str) -> str:
        # Проверяем формат: "en-US,en;q=0.9,es;q=0.8"
        pattern = r'^[a-zA-Z\-\*]+(;q=[\d\.]+)?(,[a-zA-Z\-\*]+(;q=[\d\.]+)?)*$'
        if not re.match(pattern, v):
            raise ValueError("Неверный формат заголовка Accept-Language")
        return v
