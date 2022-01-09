import logging.config
from datetime import datetime
import connexion
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from job import Job
from user import User
import yaml
import flask
from flask_cors import CORS
import flask_praetorian
guard = flask_praetorian.Praetorian()

with open('log_conf.yaml', 'r', encoding='utf-8') as f:
    log_config = yaml.safe_load(f.read())
    logging.config.dictConfig(log_config)

logger = logging.getLogger('basicLogger')

engine = create_engine('sqlite:///api.db')
Session = sessionmaker(bind=engine)

app = connexion.FlaskApp(__name__, specification_dir='')
app.app.config["SECRET_KEY"] = "top secret"
app.app.config["JWT_ACCESS_LIFESPAN"] = {"minutes": 1}
app.app.config["JWT_REFRESH_LIFESPAN"] = {"days": 1}
guard.init_app(app.app, User)

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


def register_user(body):
    logger.debug(body)
    session = Session()
    exists = session.query(User.username).filter_by(username=body['username']).first() is not None
    if exists:
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
    return flask.jsonify(ret), 200


def login():
    req = flask.request.get_json(force=True)
    username = req.get("username", None)
    password = req.get("password", None)
    user = guard.authenticate(username, password)
    ret = {
        "access_token": guard.encode_jwt_token(user),
        "username": username
    }
    return flask.jsonify(ret), 200


@flask_praetorian.auth_required
def protected():
    return flask.jsonify(
        message="protected endpoint (allowed user {})".format(
            flask_praetorian.current_user().username,
        )
    )

app.add_api('openapi.yaml', strict_validation=True)
CORS(app.app)

if __name__ == '__main__':
    app.run(port=8080, debug=False)
