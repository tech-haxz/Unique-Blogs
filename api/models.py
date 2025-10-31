from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import LargeBinary, Column

if TYPE_CHECKING:
    from .models import Blog, Users


class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    name: str = Field(index=True)
    email: str = Field(index=True)
    password: str = Field(index=True)

    blogs: List["Blog"] = Relationship(back_populates="creator")

class Blog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    body: str = Field(index=True)
    # New field for thumbnail URL
    image: Optional[str] = Field(default=None, unique=True)
    published: Optional[bool] = True

    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    creator: Optional["Users"] = Relationship(back_populates="blogs")

#A pydantic schema.
class BaseBlog(SQLModel):
    id: int
    title: Optional[str] = None
    body: Optional[str] = None
    image: Optional[str] = None
    published: Optional[bool] = None


class BaseUser(SQLModel):
    id: int
    name: str
    username: str
    email: str

# Pydantic models for response (no relationships)
class ShowUser(SQLModel):
    username: str
    name: str
    email: str
    blogs: List[BaseBlog] = None

class ShowBlog(SQLModel):
    id: int
    title: Optional[str] = None
    body: Optional[str] = None
    image: Optional[str] = None
    published: Optional[bool] = None
    creator: Optional[BaseUser] = None

class UserLogin(SQLModel):
    username: str = Field(index=True)
    password: str = Field(index=True)


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenData(SQLModel):
    username: str | None = None