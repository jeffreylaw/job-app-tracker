
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from base import Base
from sqlalchemy.orm import relationship


# A generic user model that might be used by an app powered by flask-praetorian
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    user_id = Column(String, unique=True, nullable=False)
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, server_default="true")
    jobs = relationship('Job', backref='user', lazy=True, cascade="all, delete")

    def is_valid(self):
        return self.is_active

    def to_dict(self):
        user = {}
        user['user_id'] = self.user_id
        user['username'] = self.username
        user['jobs'] = self.jobs

        return user