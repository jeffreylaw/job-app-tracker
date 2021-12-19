FROM python:3.8
EXPOSE 8080
WORKDIR /usr/src/app
COPY . .
WORKDIR api/
RUN pip install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]
