const cron = require('node-cron');

const cronFunctions = async () => {
  cron.schedule(
    '*/5 * * * *',
    async () => {
        console.log('Sending new games')
    },
    {
      scheduled: true,
    }
  );
}
module.exports = cronFunctions;