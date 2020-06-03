IMAGE_NAME=backend-api

#WORKER=docker-compose run --service-ports --rm worker
CONTAINER_NAME=build_container
WORKER=docker exec --workdir /data ${CONTAINER_NAME}
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
	# If it fails due to downstream dependencies incompatible with linux, try removing yarn.lock
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

# audit:
# 	$(WORKER) make _audit

# _audit:
# 	/bin/sh ./audit.sh

bundle:
	$(WORKER) make _bundle

_bundle:
	/bin/sh ./bundle.sh

validate_openapi:
	$(WORKER) make API_INT_PRODUCT_FILE=${API_INT_PRODUCT_FILE} API_EXT_PRODUCT_FILE=${API_EXT_PRODUCT_FILE} _validate_openapi

_validate_openapi:
	# Run APIC validation only if the files exist
	! test -f "${API_INT_PRODUCT_FILE}" || apic validate "${API_INT_PRODUCT_FILE}"
	! test -f "${API_EXT_PRODUCT_FILE}" || apic validate "${API_EXT_PRODUCT_FILE}"

# Builds the zip for UCD. You can change via the CF_ZIP_NAME var.
# e.g. make build_container CF_ZIP_NAME=my-file.zip
cf_bundle:
	$(WORKER) make CF_ZIP_NAME=${CF_ZIP_NAME} _cf_bundle

_cf_bundle:
	zip -r ${CF_ZIP_NAME} config/default.j* config/production.js dist package.json yarn.lock *.yaml defs readme.md

# Builds a production container. You can change via the IMAGE_NAME var.
# e.g. make build_container IMAGE_NAME=my-container
build_container:
	CONTAINER_NAME=$( shell docker ps | awk '/migratecf/{print $1}' )
	${WORKER} ${CONTAINER_NAME} docker build . -t $(IMAGE_NAME)

# Starts the app in a prod container. Uses env vars from .env
start_container:
	$(SERVICE)

# Opens a shell to the app's prod container. Uses env vars from .env
debug_container:
	$(SERVICE) /bin/sh

# Shuts down all docker-compose instances.
# Based on https://vsupalov.com/cleaning-up-after-docker/
clean:
	docker-compose down --remove-orphans

# Shuts down all docker-compose instances, volumes, deletes images etc.
# This will make subsequent 3M runs significantly slower
sweep:
	docker-compose down -v --rmi all --remove-orphans
	# docker system prune
