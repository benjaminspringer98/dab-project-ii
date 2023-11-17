CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO courses (name) VALUES ('Designing and Developing Scalable Web Applications');

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    text TEXT NOT NULL,
    user_uuid TEXT NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id),
    text TEXT NOT NULL,
    user_uuid TEXT NOT NULL,
    created_at TIMESTAMP
);

CREATE TYPE RESOURCE_TYPE AS ENUM ('question', 'answer');

CREATE TABLE upvotes (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id),
    answer_id INTEGER REFERENCES answers(id),
    user_uuid TEXT NOT NULL,
    type RESOURCE_TYPE NOT NULL,
    created_at TIMESTAMP
);
