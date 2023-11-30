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
  being shown in the frontend, or the error "Unexpected token 'P', "PostgresEr"... is not valid JSON", as the database tables to not yet exist then
- in this case stop the containers with `ctrl + c` and re-run them
- sometimes this can happen multiple times (at least on my pc), I have no idea
  why though
- the llm-api also takes some time to start listening to requests (check the container logs)
- if you create a question before the llm-api is listening to requests, the qa-bot service will crash and you have to manually restart it by saving the file (in dev, because of --watch, in prod it should restart on failure)
- the llm response times can also be very high, but optimizing that is not part of this project
- Also I'm on Mac M2, so I had to change some of the base images. If you run into any issues please change them back to the ones from the original project template

### Prod

- build images, run: `docker compose -f docker-compose.prod.yml up -d --build`
- for subsequent runs: `docker compose -f docker-compose.prod.yml up -d`
- to stop containers, run `docker compose down`

## Kubernetes

### Prequisites

- have Minikube + kubectl installed

### Setup

1. run `minikube start`
2. to build images, run `sh build-images.sh` (or run the commands of the file in your terminal)
3. install CloudNativePG operator: `kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.19/releases/cnpg-1.19.1.yaml`
4. enable metrics server for autoscaling: `minikube addons enable metrics-server` 
5. to apply configs, run in root directory of project: `kubectl apply -f kubernetes -R`
6. port forward the nginx service: `kubectl port-forward service/nginx-service 7800:7800`
7. access application at http://localhost:7800/

## Tests

### End-to-End Tests

- first run `docker compose up` in one terminal
- then run E2E tests with Playwright in another terminal:
  `docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf`
- notes:
  - I had to add the line `RUN npx playwright install` to the Playwright
    Dockerfile, because it just stopped working randomly at some point
  - if you are interested, the error was
    `Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium-1080/chrome-linux/chrome`
  - if you run into any problems, try removing the above mentioned line and
    building the image again

### Performance tests

1. have k6 installed
2. run `docker compose up` in one terminal
3. another terminal: cd into k6 folder and run `k6 run <test-file>`