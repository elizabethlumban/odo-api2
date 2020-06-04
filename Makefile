IMAGE_VERSION=chobday/backend-api:0.2 #Should have registry, tag
#This can be in a private registry

#WORKER=docker-compose run --service-ports --rm worker
WORKER=docker-compose -f ./.make/buildContainer.yaml run --rm worker
# WORKER=docker run --rm -it -v /data:/data -v /var/run/docker.sock:/var/run/docker.sock  --workdir /data build_container
SERVICE=docker-compose run --service-ports --rm app

# API Connect Internal Product File Name
API_INT_PRODUCT_FILE=hapi-api-starter-plans.yaml
# API Connect External Product File Name
API_EXT_PRODUCT_FILE=""

CF_ZIP_NAME=defaule-cf-bundle.zip

# Tell Make that these are commands, not files. This is needed when there're files with the same name.
# Based on: https://stackoverflow.com/questions/2145590/what-is-the-purpose-of-phony-in-a-makefile
.PHONY: bundle install compile test lint audit clean sweep

install: 
	$(WORKER) make _install 
	# TODO point to artifactory

_install:
	yarn install

build:
	$(WORKER) make _build

_build: 
	yarn run build

test:
	$(WORKER) make _test

_test:
	yarn test --passWithNoTests

dev:
	$(WORKER) make _dev
	# Ask Nik if this means start in dev mode

_dev:
	yarn dev

lint:
	$(WORKER) make _lint

_lint:
	yarn lint

audit:
	$(WORKER) make _audit

_audit:
	./.make/audit.sh

bundle:
	$(WORKER) make _bundle

_bundle:
	/bin/sh ./bundle.sh

validate_openapi:
	@echo TODO

# Builds the zip for UCD. You can change via the CF_ZIP_NAME var.
# e.g. make build_container CF_ZIP_NAME=my-file.zip
cf_bundle:
	@echo Will not implement, but most Makefile will have this

# Builds a production container. You can change via the IMAGE_NAME var.
# e.g. make build_container IMAGE_NAME=my-container
build_container:
	# CONTAINER_NAME=$( shell docker ps | awk '/migratecf/{print $1}' )
	${WORKER} make _build_container

_build_container:
	docker build . -t $(IMAGE_VERSION)
# Starts the app in a prod container. Uses env vars from .env
start_container:
	$(SERVICE)

# Opens a shell to the app's prod container. Uses env vars from .env
debug_container:
	$(SERVICE) /bin/sh

# Shuts down all docker-compose instances.
# Based on https://vsupalov.com/cleaning-up-after-docker/
clean:
	docker-compose -f ./.make/buildContainer.yaml down --remove-orphans

# Shuts down all docker-compose instances, volumes, deletes images etc.
# This will make subsequent 3M runs significantly slower
sweep:
	docker-compose -f ./.make/buildContainer.yaml down -v --rmi all --remove-orphans
	# docker system prune

deploy:
ifndef DOCKER_PASSWORD
	$(error DOCKER_ID, DOCKER_PASSWORD and/or OC_TOKEN are not defined )
endif
ifndef OC_TOKEN
	$(error DOCKER_ID, DOCKER_PASSWORD and/or OC_TOKEN are not defined )
endif
	@docker login -u $(DOCKER_ID) --password $(DOCKER_PASSWORD)
	@echo pushing image
	docker push $(IMAGE_VERSION)
	@oc login --token=$(OC_TOKEN) --server=$(OPENSHIFT_SERVER_URI)
	helm upgrade --install backend-api --namespace database .helm


#Some helper commands to get the name of a running container
start_worker: 
	@echo Starting a new worker container
	docker-compose -f ./.make/buildContainer.yaml run --rm -d worker

get_worker_name: 
	$(eval WORKER_NAME := $(shell docker ps | awk '/build/{print $$1}' ))
	@echo container is [$(WORKER_NAME)]


