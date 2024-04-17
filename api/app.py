"""
API for Job-hunting-tracker
"""
# Standard library imports
from datetime import datetime
import logging.config
import os
import uuid
import yaml

# Third-party imports
import bcrypt
import connexion
import flask
from flask import send_from_directory
from flask_cors import CORS
import jwt
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Application imports
from job import Job
from user import User
from helper import decode_auth_token
from helper import check_password

load_dotenv()
with open('log_conf.yaml', 'r', encoding='utf-8') as f:
    log_config = yaml.safe_load(f.read())
    logging.config.dictConfig(log_config)

logger = logging.getLogger('basicLogger')

if os.getenv("GITLAB_CI"):
    engine = create_engine(os.getenv("PIPELINE_ENV"))
    app = connexion.FlaskApp(__name__, specification_dir='')
else:
    engine = create_engine(os.getenv("DEV_ENV"))
    app = connexion.FlaskApp(__name__, specification_dir='')

Session = sessionmaker(bind=engine)


def get_jobs():
    """ Return user's job applications """
    try:
        decoded_payload = decode_auth_token()
    except ValueError:
        logger.error('Failed GET: /jobs due to invalid auth token')
        return "Invalid token", 401
    current_user_id = decoded_payload['id']

    logger.info(f'Retrieving jobs for user: {current_user_id}')

    session = Session()
    jobs = session.query(User).filter_by(user_id=current_user_id).first().jobs
    session.close()
    jobs_list = []
    for job in jobs:
        jobs_list.append(job.to_dict())

    res = {
        "jobs": jobs_list,
        "message": "Successfully retrieved jobs"
    }
    logger.info(f'Retrieving {len(jobs_list)} jobs for user: {current_user_id}')
    return res, 200


def add_job(body):
    """ Create a new job application """
    try:
        decoded_payload = decode_auth_token()
    except ValueError:
        logger.error('Failed POST: /jobs due to invalid auth token')
        return "Invalid token", 401
    current_user_id = decoded_payload['id']

    logger.info(f'Creating new job for user: {current_user_id}')

    try:
        post_date = datetime.fromisoformat(body['post_date'])
    except:
        post_date = None

    try:
        applied_date = datetime.fromisoformat(body['applied_date'])
    except:
        applied_date = None

    random_id = uuid.uuid4().hex
    session = Session()
    new_job = Job(
        random_id,
        body['job_title'],
        body['job_description'],
        body['company'],
        body['salary'],
        body['link'],
        post_date,
        applied_date,
        body['result'],
        body['notes'],
        current_user_id
    )
    job_dict = new_job.to_dict()
    session.add(new_job)
    session.commit()
    session.close()

    res = {
        "job": job_dict,
        "message": f'Created new job with id {random_id}'
    }
    logger.info(f'Created new job with id {random_id}')
    return res, 200


def update_job(body):
    """ Create a new job application """
    try:
        decoded_payload = decode_auth_token()
    except ValueError:
        logger.error('Failed PUT: /jobs due to invalid auth token')
        return "Invalid token", 401
    current_user_id = decoded_payload['id']

    logger.info(f'Updating job with id {body["job_id"]}')

    session = Session()
    job = session.query(Job).filter_by(job_id=body["job_id"]).first()
    if not job:
        session.close()
        return "Job does not exist", 404

    job_user_id = job.user_id
    if current_user_id != job_user_id:
        session.close()
        return "Unauthorized access", 401

    try:
        post_date = datetime.fromisoformat(body['post_date'])
    except:
        post_date = None

    try:
        applied_date = datetime.fromisoformat(body['applied_date'])
    except:
        applied_date = None

    job.job_title = body['job_title']
    job.job_description = body['job_description']
    job.company = body['company']
    job.salary = body['salary']
    job.link = body['link']
    job.post_date = post_date
    job.applied_date = applied_date
    job.result = body['result']
    job.notes = body['notes']
    
    session.merge(job)
    session.commit()
    session.close()

    res = {
        "job": body,
        "message": f'Updated job with id {body["job_id"]}'
    }
    logger.info(f'Updated job with id {body["job_id"]}')
    return res, 200


def delete_job(job_id):
    """ Delete a job """
    try:
        decoded_payload = decode_auth_token()
    except ValueError:
        logger.error('Failed DELETE: /jobs/{job_id} due to invalid auth token')
        return "Invalid token", 401
    current_user_id = decoded_payload['id']

    logger.info(f'Deleting job with id {job_id}')

    session = Session()
    job = session.query(Job).filter_by(job_id=job_id).first()
    if not job:
        session.close()
        return "Job does not exist", 404

    job_user_id = job.user_id
    if current_user_id != job_user_id:
        session.close()
        return "Unauthorized access", 401

    session.delete(job)
    session.commit()
    session.close()

    res = {
        "job_id": job_id,
        "message": f'Deleted job with id {job_id}'
    }
    logger.debug(f'Deleted job with id {job_id}')
    return res, 200


def register_user(body):
    """ Register a new user """
    logger.info(f'Attempting to register user {body["username"]}')

    session = Session()
    exists = session.query(User).filter_by(username=body['username']).first() is not None
    if exists:
        session.close()
        return "Username is taken", 401

    result = check_password(body['password'])
    if result != "valid":
        return result, 403
    password = body['password'].encode("utf-8")

    random_id = uuid.uuid4().hex
    new_user = User(
        user_id = random_id,
        username = body['username'],
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
    )
    session.add(new_user)
    session.commit()
    session.close()

    payload_data = {"id": random_id}
    token = jwt.encode(payload = payload_data, key = os.getenv('SECRET'))

    res = {
        "access_token": token,
        "username": body['username']
    }
    logger.info(f'Successfully registered a user: {body["username"]}')
    return flask.jsonify(res), 200


def login(body):
    """ Login user """
    username = body['username']
    password = body['password'].encode("utf-8")

    session = Session()
    user = session.query(User).filter_by(username=body['username']).first()
    if not user:
        session.close()
        return "Account does not exist", 404

    if not bcrypt.checkpw(password, user.hashed_password.encode('utf-8')):
        session.close()
        return "Incorrect username/password", 401
    current_user_id = user.user_id
    jobs = user.jobs
    session.close()

    jobs_list = [job.to_dict() for job in jobs]

    payload_data = {"id": current_user_id}
    token = jwt.encode(payload = payload_data, key = os.getenv('SECRET'))

    res = {
        "access_token": token,
        "username": username,
        "jobs": jobs_list
    }
    logger.info(f'Detected login from user: {current_user_id}')
    return flask.jsonify(res), 200


# WIP: Possibly add auth requirement or admin role to access this endpoint
def delete_user(body):
    """ Delete a user """
    if 'TEST_PASSWORD' in body:
        if body['TEST_PASSWORD'] != os.getenv('TEST_PASSWORD'):
            return "Incorrect test password", 401

    session = Session()
    user = session.query(User).filter_by(username=body['username']).first()
    if user is None:
        return f'User {body["username"]} does not exist', 404
    session.delete(user)
    session.commit()
    session.close()
    return f'Deleted user {body["username"]}', 200


def index():
    """ Return static index.html file """
    print(("*" * 10) + "Index endpoint" + ("*" * 10))
    return "Hello from Job application tracker API!"


app.add_api('openapi.yaml', strict_validation=False)
CORS(app.app)

if __name__ == '__main__':
    if 'DIGITALOCEAN' in os.environ:
        print("Running app on DIGITALOCEAN")
        app.run(debug=False)
    else:
        app.run(port=8000, debug=True)
