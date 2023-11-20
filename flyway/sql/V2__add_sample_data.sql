INSERT INTO courses (name) VALUES ('Designing and Developing Scalable Web Applications');

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO questions (course_id, text, user_uuid, created_at) VALUES (1, 'Could you explain the difference between vertical and horizontal scaling with examples?', uuid_generate_v4()::text, NOW());
INSERT INTO questions (course_id, text, user_uuid, created_at) VALUES (1, 'What tools and techniques are recommended for monitoring the performance of a scalable web application?', uuid_generate_v4()::text, NOW());
INSERT INTO questions (course_id, text, user_uuid, created_at) VALUES (1, 'How do I fix this error in my Deno application: os error: function not implemented', uuid_generate_v4()::text, NOW());
INSERT INTO questions (course_id, text, user_uuid, created_at) VALUES (1, 'Can someone explain microservices to me?', uuid_generate_v4()::text, NOW());
INSERT INTO questions (course_id, text, user_uuid, created_at) VALUES (1, 'In a scalable web application, how do you optimize database queries for performance?', uuid_generate_v4()::text, NOW());