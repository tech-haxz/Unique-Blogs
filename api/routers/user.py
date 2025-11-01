from fastapi import APIRouter, HTTPException, Depends, Response
from typing import Annotated
from sqlmodel import select
from ..models import Users, ShowUser, UserLogin
from ..database import SessionDep
from ..hashing import get_password_hash
from ..oauth2 import get_current_user

router = APIRouter(
    prefix="/api/v1",
    tags=['Users']
)

### Authentication and Authorization..

# Create a user.
@router.post('/users/register', status_code=201)
def create_user(users: Users, db: SessionDep):
    statement = select(Users).where(Users.username == users.username)
    statement2 = select(Users).where(Users.email == users.email)
    db_user = db.exec(statement).first()
    db_email = db.exec(statement2).first()
    if db_user:
        raise HTTPException(status_code=404, detail="Username is already registered!")
    elif db_email:
        raise HTTPException(status_code=404, detail="Email is already registered !")
    
    hashed_password = get_password_hash(users.password)
    new_user = Users(username=users.username, name=users.name, email=users.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "data": "User created successfully!"
    }


#Get a user.
@router.get('/user/{username}', response_model=ShowUser)
def get_user(username: str, db: SessionDep):
    statement = select(Users).where(Users.username == username)
    db_user = db.exec(statement).first()
    if not db_user:
        raise HTTPException(status_code=404, detail=f"User with username {username} not found!")
    return db_user


@router.get('/users/me')
def read_users_me(current_user: Annotated[Users, Depends(get_current_user)]):
    return current_user

@router.post("/users/logout")
def logout(response: Response):
    # delete cookie (works if same path/domain used when setting)
    response.delete_cookie("access_token", path="/", samesite="none")
    response.delete_cookie("refresh_token", path="/", samesite="none")

    # fallback: explicitly overwrite with empty value + expire immediately
    response.set_cookie(
        "access_token",
        "",
        httponly=True,
        max_age=0,
        expires=0,
        path="/",
        samesite="none",
        secure=True,
    )
    response.set_cookie(
        "refresh_token",
        "",
        httponly=True,
        max_age=0,
        expires=0,
        path="/",
        samesite="none",
        secure=True,
    )
    return {"message": "Logged out"}
