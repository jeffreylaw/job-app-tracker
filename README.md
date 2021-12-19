# job-hunting-tracker

# Backend
API for tracking job applications built on Python, Connexion, SQLAlchemy, and currently SQLite

## Libraries

[Connexion](https://pypi.org/project/connexion/)

[Swagger-ui-bundle](https://pypi.org/project/swagger-ui-bundle/)

[SQLAlchemy](https://pypi.org/project/SQLAlchemy/)


## Running

```
git clone https://github.com/jeffreylaw/job-hunting-tracker.git
cd api/
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 app.py
```

### Testing

```
cd api/
pytest test*.py
```

### Linting

``` 
pylint --fail-under 8.0 api/app.py
```

### To build the docker image

```
cd api/
docker build -t job-hunter-tracker .
```

# Frontend
Frontend React app for CRUD job applications