const functions = require("firebase-functions");
const newExpress = require("express");
const admin = require("firebase-admin");
const LRU = require("lru-cache");
const newHttps = require("./src/modules/https");
const newTriggers = require("./src/modules/triggers");
const newGraphQLServer = require("./src/graphql_server");
const newStore = require("./src/store");

const store_cache = new LRU({
  max: 1024,
  length: (n, key) => n * 2 + key.length,
  dispose: (key, value) => {},
  maxAge: 1000 * 60 * 60 * 24 * 365,
});

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const credential = admin.credential.cert(
    require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  );
  admin.initializeApp(credential);
} else {
  admin.initializeApp(functions.config().firebase);
}

const app = newExpress();
const store = newStore({ firestore: admin.firestore(), store_cache });
const server = newGraphQLServer({ store });

server.applyMiddleware({ app });

const https_modules = newHttps({ functions, exports });
https_modules.run({ app });

const triggers_modules = newTriggers({ functions, exports, store_cache });
triggers_modules.run({ app });
