CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_uuid TEXT NOT NULL
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    text TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    user_uuid TEXT NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id),
    text TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    user_uuid TEXT NOT NULL,
    created_at TIMESTAMP
);

