FROM ubuntu:20.04
RUN apt-get update -y && apt-get install -y python3 python3-pip libpq-dev python3-dev

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app
ENTRYPOINT ["python3"]
CMD ["app.py"]

#CMD gunicorn app:app --bind 0.0.0.0:8080
