const express = require("express");

const sqlite3 = require("sqlite3");

const { open } = require("sqlite");

const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`db error : ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//getting players array API GET Method
app.get("/players/", async (request, response) => {
  const getPlayerQuery = `SELECT * FROM cricket_team
    ORDER BY player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  let arr = [];
  for (let k of playerArray) {
    let obj = {
      playerId: k.player_id,
      playerName: k.player_name,
      jerseyNumber: k.jersey_number,
      role: k.role,
    };
    arr.push(obj);
  }
  response.send(arr);
});

//adding new player to database API POST Method

app.post("/players/", async (request, response) => {
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;
  const addPlayerQuery = `INSERT INTO 
    cricket_team (player_name, jersey_number,role)
    VALUES ('${playerName}',${jerseyNo},'${role}');`;
  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//getting player  based on player_id API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team
    WHERE player_id =${playerId};`;
  const player = await db.get(getPlayerQuery);

  response.send({
    playerId: player.player_id,
    playerName: player.player_name,
    jerseyNumber: player.jersey_number,
    role: player.role,
  });
});

//updating the player in database API PUT Method
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
     player_name = '${playerName}',
     jersey_number = ${jerseyNumber},
     role='${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//deleting player from database API DELETE Method

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team
    WHERE player_id =${playerId};`;
  await db.run(deletePlayerQuery);

  response.send("Player Removed Successfully");
});

module.exports = app;
