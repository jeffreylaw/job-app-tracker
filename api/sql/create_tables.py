import sqlite3

conn = sqlite3.connect('./api.db')
c = conn.cursor()

c.execute("DROP TABLE IF EXISTS users")
c.execute("DROP TABLE IF EXISTS jobs")

c.execute("""
    CREATE TABLE IF NOT EXISTS users
    (id INTEGER PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOL NOT NULL
    )
    """)

c.execute("""
    CREATE TABLE IF NOT EXISTS jobs
    (id INTEGER PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_description VARCHAR(255),
    company VARCHAR(255) NOT NULL,
    salary DOUBLE,
    link VARCHAR(255),
    post_date DATETIME,
    applied_date DATETIME,
    result VARCHAR(255) NOT NULL,
    notes VARCHAR(255),
    user_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
    )
    """)

conn.commit()
conn.close()