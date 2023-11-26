// const fetchGames = async () => {
//   try {
//     const response = await fetch(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json`);
//     if (!response.ok) throw Error('Did not recieve expected data');
//     // const fetchGames = await pool.query(`INSERT INTO games (id, name) VALUES ()`)
//     const fetchUpdateGames = await response.json();
//     console.log(fetchUpdateGames, 'fetchUpdateGames')
//   } catch (err){
//     console.log(err.message);
//   }
// }
const fetchGames = async () => {
  try {
    console.log('gg')
  } catch (err){
    console.log(err.message);
  }
}
module.exports =  fetchGames ;
