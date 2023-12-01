CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    title TEXT NOT NULL,
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

CREATE INDEX idx_upvotes_qid_user_uuid ON upvotes (question_id, user_uuid);
CREATE INDEX idx_questions_cid_id_created_at ON questions (course_id, id, created_at);

CREATE INDEX idx_upvotes_aid_user_uuid ON upvotes (answer_id, user_uuid);
CREATE INDEX idx_answers_qid_id_created_at ON answers (question_id, id, created_at);