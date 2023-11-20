TODO: The RUNNING.md outlines steps needed to run the application separately for the development mode and the production mode.

TODO: For merits, the RUNNING.md also outlines the steps needed to use Kubernetes to run the application with Minikube (or somilar), using kubernetes configuration files created as parts of the passing with merits requirements

# Running the application

## Docker Compose

### Prequisites

- have docker and docker compose installed

### Dev

- run `docker compose up`

#### Troubleshooting (please read these!)

- sometimes flyway won't start on the first run, leading to undefined values
  being shown in the frontend, as the database tables to not yet exist then
- in this case stop the containers with `ctrl + c` and re-run them
- sometimes this can happen multiple times (at least on my pc), I have no idea
  why though
- the llm-api also takes some time to start listening to requests (check the container logs)
- if you create a question before the llm-api is listening to requests, the consumer service will crash and you have to manually restart it by saving the file (only works in dev, because of --watch)
- the llm response times can also be very high, but optimizing that is not part of this project
- Also I'm on Mac M2, so I had to change some of the base images. If you run into any issues please change them back to the ones from the original project template

### Prod

- run `docker compose -f docker-compose.prod.yml up -d`
- to stop containers, run `docker compose down`

## Kubernetes