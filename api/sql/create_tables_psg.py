import os
from dotenv import load_dotenv
import psycopg2
dotenv_path = os.path.dirname(os.path.dirname(__file__))
load_dotenv(dotenv_path)

def create_tables():
    """ create tables in the PostgreSQL database"""
    commands = (
        'DROP TABLE IF EXISTS jobs;',
        'DROP TABLE IF EXISTS "users";',
        """ CREATE TABLE IF NOT EXISTS "users" (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN NOT NULL
        )
        """,
        """ CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                job_id VARCHAR(255) NOT NULL,
                job_title VARCHAR(255) NOT NULL,
                job_description TEXT,
                company VARCHAR(255) NOT NULL,
                salary INTEGER,
                link VARCHAR(255),
                post_date DATE,
                applied_date DATE,
                result VARCHAR(255) NOT NULL,
                notes TEXT,
                user_id VARCHAR(255) REFERENCES "users"(user_id)
                )
        """)
    conn = None
    try:

        # connect to the PostgreSQL server
        conn = psycopg2.connect(
            database="job-tracker-db", user='postgres', password='P@ssw0rd', host='127.0.0.1', port= '5432'
        )
        cur = conn.cursor()
        # create table one by one
        for command in commands:
            cur.execute(command)
        # close communication with the PostgreSQL database server
        cur.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
  
  
if __name__ == '__main__':
    create_tables()