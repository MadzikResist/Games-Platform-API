const PORT  = process.env.PORT ?? 8000
const express = require('express')
const app = express()
const pool = require('./db')
const fetchGames = require('./getUpdateGames')
app.get('/games', async (req, res) => {
  try {
    const response = await fetch(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json`);
    const listGames = await response.json();
    for (let i=0; i< listGames.applist.apps.length; i++){
      const listGamesFor =  listGames.applist.apps[i]
      if(listGamesFor.name !== ''){
        console.log( listGamesFor.appid, listGamesFor.name)
        // const insertQuery = 'INSERT INTO games (steam_appid, name) VALUES ($1, $2)';
        // await pool.query(insertQuery, [listGamesFor.appid, listGamesFor.name]);

        // const insertQuery = 'INSERT INTO games (steam_appid, name) VALUES ($1, $2)';
        // await pool.query(insertQuery, [listGamesFor.appid, listGamesFor.name]);

        // const games = await pool.query(`INSERT INTO games (steam_appid, name) VALUES ('${listGamesFor.appid}', $$${listGamesFor.name}$$)`)
        // const oneGame = await fetch(`https://store.steampowered.com/api/appdetails?appids=${listGamesFor.appid}`)
        // const oneGameList = await oneGame.json();
        // console.log(Object.keys(oneGameList[listGamesFor.appid].data));
        // res.json(oneGameList)
      }
    }
    // res.json(listGames)
  } catch (error) {
    console.error(error)
  }
})



app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
