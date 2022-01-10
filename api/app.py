import logging.config
from datetime import datetime
import connexion
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from job import Job
from user import User
import yaml
import uuid
import os
from dotenv import load_dotenv
import flask
from flask_cors import CORS
import flask_praetorian
guard = flask_praetorian.Praetorian()

load_dotenv()
with open('log_conf.yaml', 'r', encoding='utf-8') as f:
    log_config = yaml.safe_load(f.read())
    logging.config.dictConfig(log_config)

logger = logging.getLogger('basicLogger')

engine = create_engine('sqlite:///api.db')
Session = sessionmaker(bind=engine)

app = connexion.FlaskApp(__name__, specification_dir='')
app.app.config["SECRET_KEY"] = "top secret"
app.app.config["JWT_ACCESS_LIFESPAN"] = {"minutes": 60}
app.app.config["JWT_REFRESH_LIFESPAN"] = {"days": 1}
guard.init_app(app.app, User)

@flask_praetorian.auth_required
def get_jobs():
    """ Return user's job applications """
    current_username = flask_praetorian.current_user().username
    logger.info(f'Retrieving jobs for username: {current_username}')
    
    session = Session()
    jobs = session.query(User).filter_by(username=current_username).first().jobs
    session.close()
    jobs_list = []
    for job in jobs:
        jobs_list.append(job.to_dict())

    res = {
        "jobs": jobs_list,
        "message": "Successfully returned jobs"
    }
    return res, 200


@flask_praetorian.auth_required
def add_job(body):
    """ Create a new job application """
    current_user_id = flask_praetorian.current_user().id
    current_username = flask_praetorian.current_user().username
    logger.info(f'Creating new job for username: {current_username}')

    random_id = uuid.uuid4().hex
    session = Session()
    new_job = Job(
        random_id,
        body['job_title'],
        body['job_description'],
        body['company'],
        body['salary'],
        body['link'],
        datetime.fromisoformat(body['post_date']),
        datetime.fromisoformat(body['applied_date']),
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


@flask_praetorian.auth_required
def update_job(body):
    """ Create a new job application """
    logger.info(f'Updating job with id {body["job_id"]}')

    if flask_praetorian.current_user().id != body['user_id']:
        return f'Unauthorized access', 401

    session = Session()
    job = session.query(Job).filter_by(job_id=body['job_id']).first()
    job.job_title = body['job_title']
    job.job_description = body['job_description']
    job.company = body['company']
    job.salary = body['salary']
    job.link = body['link']
    job.post_date = datetime.fromisoformat(body['post_date']),
    job.applied_date = datetime.fromisoformat(body['applied_date']),
    job.result = body['result']
    job.notes = body['notes']
    session.commit()
    session.close()

    logger.info(f'Updated job with id {body["job_id"]}')
    return f'Updated job with id {body["job_id"]}', 200


@flask_praetorian.auth_required
def delete_job(body):
    """ Delete a job """
    logger.info(f'Deleting job with id {body["job_id"]}')

    if flask_praetorian.current_user().id != body['user_id']:
        return f'Unauthorized access', 401
    
    session = Session()
    job = session.query(Job).filter_by(job_id=body['job_id']).first()
    session.delete(job)
    session.commit()
    session.close()

    logger.debug(f'Deleted job with id {body["job_id"]}')
    return f'Deleted job with id {body["job_id"]}', 200


def register_user(body):
    """ Register a new user """
    logger.info(f'Attempting to register user {body["username"]}')

    session = Session()
    exists = session.query(User).filter_by(username=body['username']).first() is not None
    if exists:
        session.close()
        return "Username is taken", 401

    new_user = User(
        username = body['username'],
        hashed_password = guard.hash_password(body['password']),
        roles = "user",
    )
    session.add(new_user)
    session.commit()
    session.close()

    user = guard.authenticate(body['username'], body['password'])
    ret = {
        "access_token": guard.encode_jwt_token(user),
        "username": body['username']
    }
    logger.info(f'Successfully registered a user: {body["username"]}')
    return flask.jsonify(ret), 200


def delete_user(body):
    """ Delete a user """
    if 'TEST_PASSWORD' in body:
        test_delete_user(body)

    session = Session()
    user = session.query(User).filter_by(username=body['username']).first()
    if user is None:
        return f'User {body["username"]} does not exist', 404
    session.delete(user)
    session.commit()
    session.close()
    return f'Deleted user {body["username"]}', 200


def login(body):
    username = body['username']
    password = body['password']
    user = guard.authenticate(username, password)
    session = Session()
    jobs = session.query(User).filter_by(username=username).first().jobs
    jobs_list = []
    for job in jobs:
        jobs_list.append(job.to_dict())
    ret = {
        "access_token": guard.encode_jwt_token(user),
        "username": username,
        "jobs": jobs_list
    }
    session.close()
    return flask.jsonify(ret), 200


def test_delete_user(body):
    if body['TEST_PASSWORD'] != os.getenv('TEST_PASSWORD'):
        return
    session = Session()
    user = session.query(User).filter_by(username=body['username']).first()
    if not user:
        return f'User {body["username"]} does not exist', 404
    session.delete(user)
    session.commit()
    session.close()
    return f'TEST: Deleted user {body["username"]}', 200


app.add_api('openapi.yaml', strict_validation=False)
CORS(app.app)

if __name__ == '__main__':
    app.run(port=8080, debug=True)
