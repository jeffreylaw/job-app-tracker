import sqlite3

conn = sqlite3.connect('jobs.db')
c = conn.cursor()

c.execute("""
    CREATE TABLE jobs
    (id INTEGER PRIMARY KEY,
    job_id VARCHAR(250) NOT NULL,
    job_title VARCHAR(250) NOT NULL,
    job_description VARCHAR(250),
    company VARCHAR(250) NOT NULL,
    salary DOUBLE,
    link VARCHAR(250),
    post_date DATETIME,
    applied_date DATETIME,
    result VARCHAR(250) NOT NULL,
    notes VARCHAR(250)
    )
    """)

conn.commit()
conn.close()