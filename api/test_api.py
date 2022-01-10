import pytest
import connexion
import os
import json
from user import User
import os

import flask_praetorian
guard = flask_praetorian.Praetorian()

app = connexion.FlaskApp(__name__)
app.add_api('openapi.yaml')
app.app.config["SECRET_KEY"] = "top secret"
app.app.config["JWT_ACCESS_LIFESPAN"] = {"minutes": 60}
app.app.config["JWT_REFRESH_LIFESPAN"] = {"days": 1}
guard.init_app(app.app, User)

@pytest.fixture(scope='module')
def client():
    with app.app.test_client() as c:
        yield c

def test_register(client):
    headers = {'Content-Type': 'application/json'}
    credentials = {
        "username": "test28a678afrraac",
        "password": "passwordkafkoa39f83"
    }
    response = client.post('/register', data=json.dumps(credentials), headers=headers)
    client.post('/delete_user', data=json.dumps({'username': credentials['username'], 'TEST_PASSWORD': os.getenv('TEST_PASSWORD')}), headers=headers)
    assert response.status_code == 200

def test_get_jobs_unauthorized_status_code(client):
    response = client.get('/jobs')
    assert response.status_code == 401

def test_get_jobs_authorized_status_code(client):
    headers = {'Content-Type': 'application/json'}
    credentials = {
        "username": "test28a678afrraac",
        "password": "passwordkafkoa39f83"
    }
    response = client.post('/register', data=json.dumps(credentials), headers=headers)
    response_with_token = json.loads(response.data.decode('utf-8'))

    response = client.get('/jobs', headers={'Authorization': 'Bearer ' + response_with_token['access_token']})
    client.post('/delete_user', data=json.dumps({'username': credentials['username'], 'TEST_PASSWORD': os.getenv('TEST_PASSWORD')}), headers=headers)
    assert response.status_code == 200

def test_get_jobs_authorized_contents(client):
    headers = {'Content-Type': 'application/json'}
    credentials = {
        "username": "test28a678afrraac",
        "password": "passwordkafkoa39f83"
    }
    response = client.post('/register', data=json.dumps(credentials), headers=headers)
    response_with_token = json.loads(response.data.decode('utf-8'))

    response = client.get('/jobs', headers={'Authorization': 'Bearer ' + response_with_token['access_token']})
    response = json.loads(response.data.decode('utf-8'))

    client.post('/delete_user', data=json.dumps({'username': credentials['username'], 'TEST_PASSWORD': os.getenv('TEST_PASSWORD')}), headers=headers)
    assert type(response['jobs']) is list
    assert len(response['jobs']) == 0

# def test_add_job_status_code(client):
#     headers = {'Content-Type': 'application/json'}
#     test_job = {
#     "job_title": "DevOps Engineer",
#     "job_description": "Build and maintain modern cloud infrastructure for maximum security, reliability and uptime",
#     "company": "Untitled Company",
#     "salary": 0,
#     "link": "http://www.google.com",
#     "post_date": "2020-05-20 13:01:30",
#     "applied_date": "2020-05-20 13:01:30",
#     "result": "waiting",
#     "notes": "Lots of notes here"
#     }
#     response = client.post('/jobs', data=json.dumps(test_job), headers=headers)
#     print(response)
#     assert response.status_code == 200


# def test_add_job_response_data(client):
#     headers = {'Content-Type': 'application/json'}
#     test_job = {
#     "job_title": "DevOps Engineer",
#     "job_description": "Build and maintain modern cloud infrastructure for maximum security, reliability and uptime",
#     "company": "Untitled Company",
#     "salary": 0,
#     "link": "http://www.google.com",
#     "post_date": "2020-05-20 13:01:30",
#     "applied_date": "2020-05-20 13:01:30",
#     "result": "waiting",
#     "notes": "Lots of notes here"
#     }
#     response = client.post('/jobs', data=json.dumps(test_job), headers=headers)
#     print(response)
#     assert response.get_data(as_text=True).replace('"', "").strip() == f'Created new job application with id {test_job["job_id"]}'
