const path = require("path");
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(`error message ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
app.get("/", (response, request) => {
  response.send("Hello world");
});
