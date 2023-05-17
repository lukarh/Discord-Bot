const updateGamesMessage = require('../../utils/updateGamesMessage')
const sendDailyScoreMessage = require('../../utils/sendDailyScoreMessage')

module.exports = async (client) => {

    try {
        // non-commands
        const interval = 120000
        updateGamesMessage(client)
        setInterval(() => updateGamesMessage(client), interval)
        console.log('Automatic Functions set completed.')

        sendDailyScoreMessage(client)

    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}