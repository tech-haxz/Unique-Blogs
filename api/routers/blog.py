from fastapi import APIRouter, Query, HTTPException, status, Depends, UploadFile, File, Form
from ..database import SessionDep
from sqlalchemy.orm import selectinload
from typing import Annotated, List
from sqlmodel import select
from ..models import Blog, ShowBlog, Users, ShowUser, UserLogin
from ..oauth2 import get_current_user
from fastapi.staticfiles import StaticFiles
import shutil
import os


router = APIRouter(
    prefix='/api/v1',
    tags=['Blogs']
)

# Directory to save uploaded files
UPLOAD_DIRECTORY = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


#create blog
@router.post('/blog', status_code=status.HTTP_201_CREATED)
def create_blog(
    current_user: Annotated[UserLogin, Depends(get_current_user)],
    session: SessionDep,
    title: str = Form(...),
    body: str = Form(...),
    image: UploadFile = File(...)
):
    file_path = os.path.join(UPLOAD_DIRECTORY, image.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    file_url = f"/uploads/{image.filename}"
    # Fetch the current user from the database
    current_user = select(Users).where(Users.username == current_user.username)
    current_user = session.exec(current_user).first()

    new_blog = Blog(title=title, body=body, user_id=current_user.id, image=file_url)
    session.add(new_blog)
    session.commit()
    session.refresh(new_blog)

    return new_blog

#fetch all blogs
@router.get('/blogs', response_model=List[ShowBlog])
def get_blogs(session: SessionDep, current_user: Annotated[UserLogin, Depends(get_current_user)], offset: int = 0, limit: Annotated[int, Query(le=100)] = 100 ):
    statement = select(Blog).offset(offset).limit(limit).options(selectinload(Blog.creator))
    blogs = session.exec(statement).all()
    return blogs

#get a single blog
@router.get('/blog/{blog_id}', response_model=ShowBlog)
def get_blog(blog_id: int, session: SessionDep, current_user: Annotated[UserLogin, Depends(get_current_user)]):
    blog = session.get(Blog, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found!")
    
    return blog


#Update a blog
@router.put('/blog/{id}', status_code=status.HTTP_202_ACCEPTED)
def replace_blog(
    id: int,
    session: SessionDep,
    current_user: Annotated[UserLogin, Depends(get_current_user)],
    title: str = Form(None),
    body: str = Form(None),
    image: UploadFile = File(None)
):
    blog_db = session.get(Blog, id)
    if not blog_db:
        raise HTTPException(status_code=404, detail="Blog not Found!")

    if title is not None:
        blog_db.title = title
    if body is not None:
        blog_db.body = body
    if image is not None:
        file_path = os.path.join(UPLOAD_DIRECTORY, image.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        file_url = f"/uploads/{image.filename}"
        blog_db.image = file_url

    session.add(blog_db)
    session.commit()
    session.refresh(blog_db)
    return blog_db

#delete blog
@router.delete('/blog/{id}', status_code=status.HTTP_204_NO_CONTENT)
def destroy_blog(id: int, session: SessionDep, current_user: Annotated[UserLogin, Depends(get_current_user)]):
    blog = session.get(Blog, id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found!")
    session.delete(blog)
    session.commit()
    return {"ok": True}