# EvoPPI Frontend

EvoPPI allows the easy comparison of publicly available data from the main Protein-Protein Interaction (PPI) databases for distinct species. EvoPPI allows two types of queries: (i) same species comparisons, for those queries involving two or more interactomes from a single species, and (ii) distinct species comparisons, for those queries involving two or more interactomes from two distinct species.

## Development

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `npm run ng -- generate component component-name` to generate a new component. You can also use `npm run ng -- generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Production build

Run `npm run dist` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Building with Docker
Run `docker build -t evoppi-frontend:latest .` to build de image using the configuration in `Dockerfile`.

### Running with Docker
Run `docker run -d --name evoppi-frontend -p 8080:80 evoppi-frontend:latest` to start the container running the frontend using [Nginx](https://github.com/nginx/nginx).
The fronted will be available at `http://localhost:8080` or `http://<docker-ip>:8080` depending on your local [Docker](https://www.docker.com/) configuration.

### Other Angular commands
In order to run other `ng` commands you can run `npm run ng -- <parameters>`.

### Further help

To get more help on the Angular CLI use `npm run ng -- help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Source code

Source code of this and **EvoPPI Backend** projects can be found at:

* [EvoPPI Frontend](https://github.com/sing-group/evoppi-frontend)
* [EvoPPI Backend](https://github.com/sing-group/evoppi-backend)