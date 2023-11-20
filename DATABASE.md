TODO: The DATABASE.md outlines the database schema and justifies the used indexes and database denormalization decisions.

TODO for merits: Caching decisions are outlined in DATABASE.md.

# Database decisions

## Schema and (De)normalization

- The db has 4 tables: courses, questions, answers, upvotes
- these were not denormalized, to follow best practices, as the course handout heavily implied a database schema mostly following 1:n relations where 1 course has n questions, 1 question has n answers
- however, a users table was not implemented, because
    1. this way joins on the users table are be avoided, when e.g. showing the username (user uuid) next to a question or answer
    2. there is no login fuctionality anyway, thus no login data needs to be stored

## Indexes

- the `EXPLAIN` SQL statement was used to analyze  queries (with 1 million records in the respective tables)
- in the upvotes table, multi-column-indexes were created for question_id & user_uuid and answer_id & user_uuid as these columns get queried together multiple times
- benefits:
    - query both columns: around 0.5% of the previous execution time
    - query question_id: around 50% of the previous execution time
    - no significant negative impact on inserts or deletes in upvotes table
- another multi-column-index was implemented in the columns course_id, id, and created_at in the questions table
- same was done for the anwers table, with columns question_id, id, and created_at
- this reduced the execution time of 
the query to get the 20 most recent questions/answers by around 50%

## Caching

- Caching in general is beneficial, when there are more read than write operations
- it would be nice to cache the big query which gets the 20 most recent questions / answers, however in such an application, caches would have to be purged very frequently, because of the upvote mechanism being used a lot
- purging every time a user upvotes a question would add a lot of overhead
- further, postgres has some internal caching mechanism implemented, which diminishes the returns of self-built caching solutions anyways
- therefore, caching of db results is not implemented for most the question and answer services
- However, the findById query for questions and all queries for courses can easily be cached 
- as there is no functionality to create/delete courses, or delete questions through the API, these caches wouldn't even need to be purged