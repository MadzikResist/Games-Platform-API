const cron = require('node-cron');

const cronFunctions = async () => {
  cron.schedule(
    '*/1 * * * *',
    async () => {
        console.log('Sending new games', Math.random())
      try {
        const response = await fetch(
          "https://games-platform-api.onrender.com/games",
        );
        const data = await response.json();
        console.log('data', data.length)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    {
      scheduled: true,
    }
  );
}
module.exports = cronFunctions;