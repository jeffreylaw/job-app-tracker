import pytest
import connexion
import json

app = connexion.FlaskApp(__name__)
app.add_api('openapi.yaml')

@pytest.fixture(scope='module')
def client():
    with app.app.test_client() as c:
        yield c


def test_get_jobs_status_code(client):
    response = client.get('/jobs')
    assert response.status_code == 200


def test_add_job_status_code(client):
    headers = {'Content-Type': 'application/json'}
    test_job = {
    "job_id": "A1",
    "job_title": "DevOps Engineer",
    "job_description": "Build and maintain modern cloud infrastructure for maximum security, reliability and uptime",
    "company": "Untitled Company",
    "salary": 0,
    "link": "http://www.google.com",
    "post_date": "2020-05-20 13:01:30",
    "applied_date": "2020-05-20 13:01:30",
    "result": "waiting",
    "notes": "Lots of notes here"
    }
    response = client.post('/jobs', data=json.dumps(test_job), headers=headers)
    assert response.status_code == 200


def test_add_job_response_data(client):
    headers = {'Content-Type': 'application/json'}
    test_job = {
    "job_id": "A1",
    "job_title": "DevOps Engineer",
    "job_description": "Build and maintain modern cloud infrastructure for maximum security, reliability and uptime",
    "company": "Untitled Company",
    "salary": 0,
    "link": "http://www.google.com",
    "post_date": "2020-05-20 13:01:30",
    "applied_date": "2020-05-20 13:01:30",
    "result": "waiting",
    "notes": "Lots of notes here"
    }
    response = client.post('/jobs', data=json.dumps(test_job), headers=headers)
    assert response.get_data(as_text=True).replace('"', "").strip() == f'Created new job application with id {test_job["job_id"]}'
