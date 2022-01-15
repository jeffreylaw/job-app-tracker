FROM python:3.8
EXPOSE 8080
COPY . .
WORKDIR api/
RUN pip install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]
