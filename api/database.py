from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine 


sqlite_file_name = "./blog.db"
# sqlite_url = f"sqlite:///{sqlite_file_name}"

postgres_url = "postgresql://database_0iv1_user:aLtBa5eP5bsCbr5M7Y1QyRBIyhEvxc9I@dpg-d42rt6gdl3ps73cnkjv0-a/database_0iv1"

connect_args = {"check_same_thread": False}
engine = create_engine(postgres_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]