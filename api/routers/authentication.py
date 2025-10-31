from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from datetime import timedelta
from typing import Annotated
from ..database import SessionDep
from ..models import Users
from sqlmodel import select
from ..hashing import verify_password
from .JWTtoken import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, create_refresh_token
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(
    prefix='/api/v1',
    tags=['Authentication']
)

#login
@router.post('/users/login')
def login(request: Annotated[OAuth2PasswordRequestForm, Depends()], db: SessionDep, response: Response):
    statement = select(Users).where(Users.username == request.username)
    db_user = db.exec(statement).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found!")
    if not verify_password(request.password, db_user.password):
        raise HTTPException(status_code=401, detail="Incorrect Credentials!")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(days=7)
    refresh_token = create_refresh_token(
        data={"sub": db_user.username}, expires_delta=refresh_token_expires
    )

    # Set httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none",
        secure=True  # Set to True in production with HTTPS
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,  # 7 days
        samesite="none",
        secure=True  # Set to True in production with HTTPS
    )
    return {"message": "Login successful"}

# Using refresh token to get a new access token
@router.post('/users/refresh')
def refresh_token(response: Response, refresh_token: str = Cookie(None)):
    import jwt
    from jwt import PyJWTError
    from .JWTtoken import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none",
        secure=True
    )
    return {"access_token": access_token}


