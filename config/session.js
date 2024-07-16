const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
  const MongoDBStore = mongoDbStore(session);
  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "Ez-shop",
    collection: "session",
  });
  return store;
}

function createSessionConfig() {
  return {
    secret: "session_secret@129806666",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
