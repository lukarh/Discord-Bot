// imports
const cron = require('node-cron')

const { getCurrentDateTime } = require(`./getCurrentDateTime`)
const { getTodaysGames, getScoreboard, getTodaysOdds } = require('./getLiveNBAData')
const { createGameScoreEmbed, addGameColorToEmbed, addGameDetailsToEmbed, addNoGamesDetailToEmbed } = require('./addEmbedDetails')

async function sendDailyScoreMessage (client) {
    // declare a scheduled time for the bot to update the channel at
    const scheduleTime = '30 3 * * *'

    console.log('----------------------------------------')
    console.log('Setting up Scheduled Function...')

    cron.schedule(scheduleTime, async() => {

        console.log('Triggered Daily Function.')
        const channel = client.channels.cache.get(process.env.NBA_GAME_CHANNEL_ID)

        const results = await getCurrentDateTime()
        const todaysDate = results.todaysDate
        const currentTime = results.currentTime

        const todaysGames = await getTodaysGames(todaysDate)

        let gameCount = 1;

        if (todaysGames !== undefined) {

            const liveGameObjects = await getScoreboard(rawJSON=false)
            const oddsObjects = await getTodaysOdds(rawJSON=false)
            const todaysGames = await getTodaysGames(todaysDate)

            for (const gameInfo of todaysGames) {
                
                const scoresEmbed = await createGameScoreEmbed(todaysDate, currentTime)
                
                const gameID = gameInfo.gameId
                const liveGameInfo = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
                const gameOddsInfo = oddsObjects.find(gameOddsInfo => gameOddsInfo.gameId === gameID)
                
                let gameStatus = gameInfo.gameStatus // 1 - hasn't started, 2 - live, 3 - final
                gameStatus = (liveGameInfo !== undefined) ? liveGameInfo.gameStatus : gameStatus
                
                await addGameColorToEmbed(gameInfo, scoresEmbed)
                await addGameDetailsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, gameOddsInfo, scoresEmbed)
                
                channel.send({ content: `${todaysDate} - Game #${gameCount} | Game ID: [${gameID}]`, embeds: [scoresEmbed] }) 
                
                gameCount++
            }
        } else {
            const scoresEmbed = await createGameScoreEmbed(todaysDate, currentTime)
            await addNoGamesDetailToEmbed(scoresEmbed)

            channel.send({ content: `${todaysDate} - No Games`, embeds: [scoresEmbed] })
        }
    })

    console.log('Finished setting up Scheduled Function!!')
    console.log('----------------------------------------')
}

module.exports = sendDailyScoreMessage;