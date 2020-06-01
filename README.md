This is an express backend code for https://github.com/elizabethlumban/react-starter2. This is deployed in OCP 4.3 using odo.

## Prerequisite

Use node v12.11.1.
You can login to your OCP cluster by,

```
oc login --token=g0hTBBBBUUj9v85hPNyxxxx --server=https://c1111-e.gb.containers.cloud.ibm.com:78932
```

## Installation

In the project directory, run:

```
odo project set sampleproject
odo create nodejs:12 odo-api
odo url create --secure
odo push
```

## dev
export PORT=3001
npm run start-dev