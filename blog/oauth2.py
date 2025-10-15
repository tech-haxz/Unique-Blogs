from fastapi import Depends, HTTPException, status, Request
from typing import Annotated
from .routers.JWTtoken import verify_token
from fastapi.security import OAuth2PasswordBearer 



oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/users/login')


# to get a string like this run:
# openssl rand -hex 32
# SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_current_user(request: Request):
    # print("Received Token in get_current_user:", token)
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    return verify_token(token, credentials_exception)