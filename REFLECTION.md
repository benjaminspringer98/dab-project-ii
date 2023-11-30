TODO: There is a brief description of the application in REFLECTION.md that highlights key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.

# Key design decisions

## Basic functionality

- users can create questions and answer questions
- users can upvote questions/answers and undo their own upvotes
- llm generates 3 answers for each question
- maximum of twenty questions and answers are shown on the course page and the question page

## Server Side Rendering (SSR)

- as there is a lot of nested data (e.g. courses can have multiple questions), dynamic routing was implemented
- this allows frontend routes like /courses/1/questions/5
- this requires SSR, which in turn requires an adapter
- Deno is used for this purpose, documentation [here](https://github.com/denoland/deno-astro-adapter)
- the astro build command builds a file called `entry.mjs`, which can be used in our Dockerfile.prod to start a Deno app serving the server-side-rendered frontend

## Message queue

- a message queue for user submitted questions/answers wouldn't benefit us a lot here, as questions/answers are just added to the database, in comparison to the project 1, where each submission required starting a separate Docker container
- as LLM answers take while to generate, a Redis message queue is used here
- qa-api writes into the queue, qa-bot reads from the queue, calls llm-api, and posts llm response back to qa-api
- this creates a decoupling, where the main qa-api does not care when e.g. the qa-bot crashes

## Pagination / Infinite scrolling

- pagination was used to implement infinite scrolling
- frontend keeps track of the page number that should be fetched
- when the user has almost scrolled to the end of the page, the page number is incremented and is passed to backend to get the correct batch of data

## Real time updates

- when new questions/answers are created, they are shown to the user in real time
- Websockets are used for this, with the two endpoints `/api/ws/:cId` and `/api/ws/:qId`
- first is for new questions for a courseId, second for new answers for a questionId
- on opening one of the pages, the question/answer id and websocket are added to a map
- when a question/answer is created, all connected sockets in the map with the corresponding question/answer id are notified with the created object
- on page close the socket and id are removed from the map

## Dev vs. Prod config

Prod:

- containers restart on failure
- removed volume mapping between host machine and containers, which was only there for dev purposes
- APIs using Deno: removed unnecessary flags from the Dockerfiles
- data in the db is persisted (locally)
- UI is built with astro build and uses SSR adapter rather than using astro dev

## Kubernetes

- Kubernetes config files are in place, allowing the application to be ran locally using e.g. Minikube
- to be able to run the same project with both docker compose and minikube, the same service names were used in both configs
- autoscaling is in place just for API and UI, as suggested by the TAs
- database is set up using a cluster

## Future outlook: Improving performance

- one could most likely improve the indexing or database denormalization, as I did not feel fully competent enough to do this through the lecture materials, and doing a bit of research on my own