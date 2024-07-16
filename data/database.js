const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;
async function connecToDatabase() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("Ez-shop");
}

function getDb() {
  if (!database) {
    throw new Error("You must connetct to database first");
  }
  return database;
}

module.exports = {
  connecToDatabase: connecToDatabase,
  getDb: getDb,
};
