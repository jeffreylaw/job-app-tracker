import sqlite3

conn = sqlite3.connect('api.db')
c = conn.cursor()

c.execute("""
    CREATE TABLE IF NOT EXISTS users
    (id INTEGER PRIMARY KEY,
    username VARCHAR(250),
    hashed_password VARCHAR(250),
    roles VARCHAR(250),
    is_active BOOL
    )
    """)

c.execute("""
    CREATE TABLE IF NOT EXISTS jobs
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
    notes VARCHAR(250),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
    )
    """)

conn.commit()
conn.close()