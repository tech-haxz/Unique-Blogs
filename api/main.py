from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import create_db_and_tables
from .routers import blog, user, authentication
from fastapi.staticfiles import StaticFiles
import os

from fastapi.middleware.cors import CORSMiddleware

#To create database and tables on startup.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
   yield create_db_and_tables()



app = FastAPI(lifespan=lifespan)

origins = [
    "https://unique-blogs.netlify.app",
    "http://localhost:5173/",
    "http://localhost:8000",
]

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIRECTORY = os.path.join(os.getcwd(), "uploads")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIRECTORY), name="uploads")


app.get("/")(lambda: {"message": "Welcome to FastAPI Blog Application"})

app.include_router(authentication.router)
app.include_router(blog.router)
app.include_router(user.router)
