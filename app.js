const path = require("path");
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());

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

app.get("/players/", async (request, response) => {
  const reqData = `SELECT * FROM 
    cricket_team
    ORDER BY player_id`;
  const data = await db.all(reqData);
  response.send(
    data.map((eachitem) => {
      return {
        playerId: eachitem.player_id,
        playerName: eachitem.player_name,
        jerseyNumber: eachitem.jersey_number,
        role: eachitem.role,
      };
    })
  );
});

//Posting the details
app.post("/players/", async (request, response) => {
  const data = request.body;
  console.log(data);
  const { player_name, jersey_number, role } = data;
  console.log(player_name);
  const insertingData = `INSERT INTO cricket_team(player_name, jersey_number, role)
  values("${player_name}",${jersey_number},"${role}")`;
  let postedData = await db.run(insertingData);

  const convertDbObject = (eachitem) => {
    return {
      playerId: eachitem.player_id,
      playerName: eachitem.player_name,
      jerseyNumber: eachitem.jersey_number,
      role: eachitem.role,
    };
  };
  posteData = convertDbObject(postedData);
  response.send("Player Added to Team");
});

//getting the player details based on the given input
app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  console.log(playerId.playerId);
  const playerDetails = `SELECT
  * FROM cricket_team
  where player_id=${playerId.playerId}`;
  const responsePlayerDetails = await db.get(playerDetails);
  const convertDbObject = (eachitem) => {
    return {
      playerId: eachitem.player_id,
      playerName: eachitem.player_name,
      jerseyNumber: eachitem.jersey_number,
      role: eachitem.role,
    };
  };
  const responsePlayerDetailsReq = convertDbObject(responsePlayerDetails);

  response.send(responsePlayerDetailsReq);
});

//put request
app.put("/players/:postPlayerId/", async (request, response) => {
  const { postPlayerId } = request.params;
  console.log(postPlayerId);
  const dataReq = request.body;
  console.log(dataReq);
  const { player_name, jersey_number, role } = dataReq;
  const dataAssaignment = `UPDATE cricket_team
  SET 
  player_name="${player_name}",
  jersey_number=${jersey_number},
  role="${role}"
  WHERE player_id=${postPlayerId}`;
  const postResponse = await db.run(dataAssaignment);
  console.log(postResponse);
  response.send("Player Details Updated");
});

//deleting the player
app.delete("/players/:deletePlayerId", async (request, response) => {
  const { deletePlayerId } = request.params;
  console.log(deletePlayerId);
  const deleteCode = `
  DELETE FROM cricket_team
  WHERE player_id=${deletePlayerId}`;
  const deleteresponse = await db.run(deleteCode);
  response.send("Player Removed");
});

module.exports = app;
