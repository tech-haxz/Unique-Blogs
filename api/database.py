from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

# ✅ Use PostgreSQL connection string (add +psycopg2)
postgres_url = "postgresql://database_0iv1_user:aLtBa5eP5bsCbr5M7Y1QyRBIyhEvxc9I@dpg-d42rt6gdl3ps73cnkjv0-a.oregon-postgres.render.com/database_0iv1"

# ✅ No connect_args needed for PostgreSQL
engine = create_engine(postgres_url, echo=True)  # echo=True prints SQL logs (optional)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
