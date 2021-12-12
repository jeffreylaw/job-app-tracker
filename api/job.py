from sqlalchemy import Column, Integer, Float, String, DateTime
from base import Base

class Job(Base):
    __tablename__ = 'jobs'

    id = Column(Integer, primary_key=True)
    job_id = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(String)
    company = Column(String, nullable=False)
    salary = Column(Float)
    link = Column(String, nullable=False)
    post_date = Column(DateTime)
    applied_date = Column(DateTime)
    result = Column(String, nullable=False)
    notes = Column(String)

    def __init__(self, job_id, job_title, job_description, company, salary, link, post_date, applied_date, result, notes):
        self.job_id = job_id
        self.job_title = job_title
        self.job_description = job_description
        self.company = company
        self.salary = salary
        self.link = link
        self.post_date = post_date
        self.applied_date = applied_date
        self.result = result
        self.notes = notes

    def to_dict(self):
        job = {}
        job['job_id'] = self.job_id
        job['job_title'] = self.job_title
        job['job_description'] = self.job_description
        job['company'] = self.company
        job['salary'] = self.salary
        job['link'] = self.link
        job['post_date'] = self.post_date
        job['applied_date'] = self.applied_date
        job['result'] = self.result
        job['notes'] = self.notes

        return job