const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializingServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`db error: ${e.message}`);
  }
};

initializingServerAndDb();

app.get("/players/", async (request, response) => {
  const allPlayersQuery = `SELECT 
        * 
        FROM
        cricket_team;`;
  const dbResponse = await db.all(allPlayersQuery);
  response.send(dbResponse);
});

app.post("/players/", async (request, response) => {
  const { playerDetails } = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const postPlayerQuery = `INSERT 
    INTO
    cricket_team(
    player_name,
    jersey_number,
    role )
    VALUES 
    (
    '${player_name}'
    '${jersey_number}'
    '${role}')
;`;
  const dbResponse = await db.run(postPlayerQuery);
  const player = dbResponse.lastID;
  response.send(player);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playersQuery = `SELECT 
        * 
        FROM
        cricket_team
        WHERE 
         player_id = '${playerId}';`;
  const convey = await db.get(playersQuery);
  response.send(convey);
});

app.put("/players/:playerId/", async (request, response) => {
  const playersId = request.params;
  const playersDetails = request.body;

  const { player_id, player_name, jersey_number, role } = playersDetails;
  const playersDetailsQuery = `UPDATE 
        cricket_team
        SET 
        player_name = '${player_name},
        jersey_number ='${jersey_number},
        role ='${role} 
        WHERE
        player_id = '${player_id}' ;`;
  const respond = await db.run(playersDetailsQuery);
  respond.send("Updated");
});
