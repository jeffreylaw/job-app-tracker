import os
from dotenv import load_dotenv
import psycopg2

dotenv_path = os.path.dirname(os.path.dirname(__file__))
load_dotenv(dotenv_path)

def drop_tables():
    """ create tables in the PostgreSQL database"""
    commands = (
        'DROP TABLE IF EXISTS jobs;',
        'DROP TABLE IF EXISTS "users";',
        )
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
    drop_tables()