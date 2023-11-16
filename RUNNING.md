TODO: The RUNNING.md outlines steps needed to run the application separately for the development mode and the production mode.

TODO: For merits, the RUNNING.md also outlines the steps needed to use Kubernetes to run the application with Minikube (or somilar), using kubernetes configuration files created as parts of the passing with merits requirements

## Running the actual application

### Docker Compose

#### Dev

- run `docker compose up`
- sometimes flyway won't start on the first run, leading to undefined values
  being shown in the frontend, as the database tables to not exist
- in this case stop the containers with `ctrl + c` and re-run them
- sometimes this can happen multiple times (at least on my pc), I have no idea
  why though

#### Prod

- run `docker compose -f docker-compose.prod.yml up -d`
- to stop, run `docker compose down`

### Kubernetes