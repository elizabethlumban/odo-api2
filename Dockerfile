FROM node:12-alpine AS BUILD_IMAGE
RUN apk update && apk add curl bash

WORKDIR /usr/app
COPY . .
RUN npm install 
RUN npm run build

FROM node:12-alpine
WORKDIR /usr/app

ENV PORT 3001
COPY --from=BUILD_IMAGE /usr/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/app/package.json ./package.json
RUN npm install --production

EXPOSE 3001
CMD ["bash"]
CMD [ "npm", "run", "start" ]