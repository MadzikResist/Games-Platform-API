const pool = require('./db')


const addGamesToDB = async () => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  try {
    const response = await fetch(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json`);
    const listGames = await response.json();
    for (let i=7000; i< listGames.applist.apps.length; i++){
      const listGamesFor =  listGames.applist.apps[i]
      if(listGamesFor.name !== '' ){
        // console.log( listGamesFor.appid, listGamesFor.name)
        // const insertQuery = 'INSERT INTO games (steam_appid, name) VALUES ($1, $2)';
        // await pool.query(insertQuery, [listGamesFor.appid, listGamesFor.name]);


        const oneGame = await fetch(`https://store.steampowered.com/api/appdetails?appids=${listGamesFor.appid}`)
        const oneGameList = await oneGame.json();
        console.log(oneGameList[listGamesFor.appid]?.data?.name, oneGameList[listGamesFor.appid]?.data?.recommendations)
        // console.log(oneGameList)
        if(oneGameList[listGamesFor.appid]?.success === true && oneGameList[listGamesFor.appid]?.data?.recommendations ){
          console.log('SUCCESS', oneGameList[listGamesFor.appid]?.recommendations)
          const oneGameQuery = oneGameList[listGamesFor.appid]?.data
          // console.log('oneGameQuery', oneGameQuery)

          const insertQuery = 'INSERT INTO gamesNew (steam_appid, name, detailed_description, required_age, is_free, about_the_game, short_description, supported_languages, header_image, capsule_image, capsule_imagev5, website, pc_requirements, mac_requirements, linux_requirements, developers, publishers, package_groups, platforms, categories, genres, screenshots, movies, release_date, support_info, background, background_raw, content_descriptors, recommendations ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29 )';
          await pool.query(insertQuery, [oneGameQuery?.steam_appid, oneGameQuery?.name, oneGameQuery?.detailed_description, oneGameQuery?.required_age, oneGameQuery?.is_free, oneGameQuery?.about_the_game, oneGameQuery?.short_description, oneGameQuery?.supported_languages, oneGameQuery?.header_image, oneGameQuery?.capsule_image, oneGameQuery?.capsule_imagev5, oneGameQuery?.website, oneGameQuery?.pc_requirements, oneGameQuery?.mac_requirements, oneGameQuery?.linux_requirements, oneGameQuery?.developers, oneGameQuery?.publishers, oneGameQuery?.package_groups, oneGameQuery?.platforms, oneGameQuery?.categories,  oneGameQuery?.genres,  oneGameQuery?.screenshots,  oneGameQuery?.movies,  oneGameQuery?.release_date , oneGameQuery?.support_info, oneGameQuery?.background, oneGameQuery?.background_raw, oneGameQuery?.content_descriptors, oneGameQuery?.recommendations]);
          // if(oneGameQuery?.recommendations !== undefined)
          // {
          //   // const insertQuery = `UPDATE games SET recommendations = ${oneGameQuery?.recommendations} WHERE steam_appid IS NOT NULL AND steam_appid =  ${oneGameQuery?.steam_appid}`;
          //   // await pool.query(insertQuery);
          //   // const insertQuery = 'UPDATE games SET recommendations = $1 WHERE steam_appid = $2';
          //   // await pool.query(insertQuery, [oneGameQuery?.recommendations, oneGameQuery?.steam_appid]);
          //   // console.log("updated id", oneGameQuery?.steam_appid)
          // }


          // console.log(oneGameQuery)

          // console.log(Object.keys(oneGameList[listGamesFor.appid].data));
        }


      }
      console.log('timeout', i);
      if( i % 200 === 0 && i){
        console.log('timeout');
        // await sleep(240000);
        await sleep(340000);
      }
    }
    // res.json(listGames)
  } catch (error) {
    console.error("error in addGamesToDB", error)
  }
}

module.exports = addGamesToDB;
