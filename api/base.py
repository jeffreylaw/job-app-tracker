from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///api.db')
session_factory = sessionmaker(bind=engine)
SessionLocal = scoped_session(session_factory)


Base = declarative_base()
Base.query = SessionLocal.query_property()
