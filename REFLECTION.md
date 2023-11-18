TODO: There is a brief description of the application in REFLECTION.md that highlights key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.

# Key design decisions

## Basic functionality

- users can upvote questions/answers and undo their own upvotes

## Server Side Rendering (SSR)

- as there is a lot of nested data (e.g. courses can have multiple questions), dynamic routing was implemented
- this allows routes like /courses/1/questions/5
- this requires SSR, which in turn requires an adapter
- Deno is used for this purpose, documentation [here](https://github.com/denoland/deno-astro-adapter)
- the astro build command builds a file called `entry.mjs`, which can be used in our Dockerfile.prod to start a Deno app serving the server-side-rendered frontend

## Message queue

- a message queue for user submitted questions/answers wouldn't benefit a lot here, as questions/answers are just added to the database, in comparison to the project 1, where each submission required starting a separate Docker container
- as LLM answers take while to generate, a message queue is used here