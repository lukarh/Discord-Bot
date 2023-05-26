// imports
const updateGamesMessage = require('../../utils/updateGamesMessage')
const sendDailyScoreMessage = require('../../utils/sendDailyScoreMessage')

module.exports = async (client) => {
    try {
        // register the automatic live game channel updates function
        const interval = 45000
        updateGamesMessage(client)
        setInterval(() => updateGamesMessage(client), interval)
        // register the automatic daily send new live game channel message function
        await sendDailyScoreMessage(client)
        console.log('2) Finished registering automatic command functions!')

    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}