import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

#load env
load_dotenv()

#get the database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set! "
        "Please set it in Vercel or in your .env file."
    )

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

#database engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"sslmode": "require"},
)

#session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#declarative base class
Base = declarative_base()

#dependency to get DB session
def get_db():
    """Yields a database session and guarantees it is closed afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()