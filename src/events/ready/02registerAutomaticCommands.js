const updateGamesMessage = require('../../utils/updateGamesMessage')
const sendDailyScoreMessage = require('../../utils/sendDailyScoreMessage')

module.exports = async (client) => {

    try {
        // non-commands
        const interval = 120000
        updateGamesMessage(client)
        setInterval(() => updateGamesMessage(client), interval)
        await sendDailyScoreMessage(client)
        console.log('Finished registering automatic command functions')

    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}