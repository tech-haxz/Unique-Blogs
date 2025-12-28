from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

# ✅ Use PostgreSQL connection string (add +psycopg2)
postgres_url = "postgresql://vinay:oLkzkvQrkXXlnQo8JOCIG48mgRhtoBia@dpg-d58j6hjuibrs73aot2d0-a.oregon-postgres.render.com/uniqueblogs_db"

# ✅ No connect_args needed for PostgreSQL
engine = create_engine(postgres_url, echo=True)  # echo=True prints SQL logs (optional)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
