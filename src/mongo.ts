import mongoose from "mongoose";
import { isDev } from "./environment/envUtil";

(mongoose.Promise as any) = global.Promise;

const connectToDb = () => {
  const url = getConnectionURL();
  const options = getConnectionOptions();

  return new Promise((resolve, reject) =>
    mongoose.connect(url, options, err => {
      err ? reject(err) : resolve();
    }),
  );
};

export function getMongoDeployment() {
  const services = JSON.parse(process.env.VCAP_SERVICES!);
  const cfMongodbServices = services["databases-for-mongodb"];
  let mongodbConn;
  // test Cloud Foundary Environment
  if (cfMongodbServices) {
    mongodbConn = cfMongodbServices[0].credentials.connection.mongodb;
  }
  // try K8 environment binding
  if (!mongodbConn) {
    if (process.env.BINDING) {
      const binding = JSON.parse(process.env.BINDING);
      mongodbConn = binding.connection.mongodb;
    }
  }
  return mongodbConn;
}

function getConnectionOptions() {
  if (isDev()) {
    return {
      reconnectTries: 4,
    };
  }

  const mongodbConn = getMongoDeployment();

  const options: any = {
    ssl: true,
    sslValidate: true,
    poolSize: 50,
    reconnectTries: 4,
    useNewUrlParser: true,
  };

  if (process.env.MONGODB_USE_SSL) {
    options.ssl = process.env.MONGODB_USE_SSL == "true";
  }

  if (process.env.MONGODB_VALIDATE_SSL) {
    options.sslValidate = process.env.MONGODB_VALIDATE_SSL == "true";
  }

  if (mongodbConn) {
    if (mongodbConn.certificate.certificate_base64) {
      const ca = [Buffer.from(mongodbConn.certificate.certificate_base64, "base64")];
      options.sslCA = ca;
    }
  }
  return options;
}

const uriFromVCAP = () => {
  const services = JSON.parse(process.env.VCAP_SERVICES!);
  const cfMongodbServices = services["databases-for-mongodb"];
  return cfMongodbServices[0].credentials.connection.mongodb.composed[0];
};

export const getConnectionURL = () => {
  return isDev() ? "mongodb://localhost/latrobe-db" : uriFromVCAP();
};

export default connectToDb;
