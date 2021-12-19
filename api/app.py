import logging.config
from datetime import datetime
import connexion
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from job import Job
import yaml


with open('log_conf.yaml', 'r', encoding='utf-8') as f:
    log_config = yaml.safe_load(f.read())
    logging.config.dictConfig(log_config)

logger = logging.getLogger('basicLogger')

engine = create_engine('sqlite:///jobs.db')
Session = sessionmaker(bind=engine)

def get_jobs():
    """ Return all job applications """
    logger.debug('Getting all jobs')

    session = Session()
    jobs = session.query(Job).all()
    session.close()

    jobs_list = []
    for job in jobs:
        jobs_list.append(job.to_dict())

    return jobs_list, 200


def add_job(body):
    """ Create a new job application """
    logger.debug('Creating new job')

    session = Session()
    new_job = Job(
        body['job_id'],
        body['job_title'],
        body['job_description'],
        body['company'],
        body['salary'],
        body['link'],
        datetime.fromisoformat(body['post_date']),
        datetime.fromisoformat(body['applied_date']),
        body['result'],
        body['notes']
    )
    session.add(new_job)
    session.commit()
    session.close()

    logger.debug(f'Created new job application with id {body["job_id"]}')
    return f'Created new job application with id {body["job_id"]}', 200


app = connexion.FlaskApp(__name__, specification_dir='')
app.add_api('openapi.yaml', strict_validation=True)

if __name__ == '__main__':
    app.run(port=8080, debug=False)
