const teamEmojis = require(`../assets/teams/emojis.json`)

const { getCurrentDateTime } = require(`./getCurrentDateTime`)
const { getTodaysGames, getScoreboard, getTodaysOdds } = require('./getLiveNBAData')
const { createGameScoreEmbed, addGameColorToEmbed, addGameDetailsToEmbed, addNoGamesDetailToEmbed } = require('./addEmbedDetails')


async function updateGamesMessage(client) {
    const channel = client.channels.cache.get(process.env.NBA_GAME_CHANNEL_ID)
    const messageObjs = await channel.messages.fetch()
    const messageIDs = messageObjs.keys()
    const message = messageObjs.first()
    const latestMessageID = messageIDs.next().value

    // fetch currentDateTime
    const results = await getCurrentDateTime()
    // const todaysDate = results.todaysDate
    const todaysDate = "05/24/2023"
    const currentTime = results.currentTime

    // create new embed for scores
    const scoresEmbed = await createGameScoreEmbed(todaysDate, currentTime)

    if (message) {
        // fetch schedule, today's scoreboard of games, and today's game odds
        const liveGameObjects = await getScoreboard(rawJSON=false)
        const oddsObjects = await getTodaysOdds(rawJSON=false)
        const todaysGames = await getTodaysGames(todaysDate)

        // check if there are any NBA games scheduled for today
        if (todaysGames !== undefined) {

            for (const gameInfo of todaysGames) {

                const gameID = gameInfo.gameId
                const liveGameInfo = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
                const gameOddsInfo = oddsObjects.find(gameOddsInfo => gameOddsInfo.gameId === gameID)

                let gameStatus = gameInfo.gameStatus // 1 - hasn't started, 2 - live, 3 - final
                gameStatus = (liveGameInfo !== undefined) ? liveGameInfo.gameStatus : gameStatus

                await addGameColorToEmbed(gameInfo, scoresEmbed)
                await addGameDetailsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, gameOddsInfo, scoresEmbed)
            }

        // otherwise, there are no games for today
        } else {
            await addNoGamesDetailToEmbed(scoresEmbed)
        }
    }

    await message.edit({ embeds: [scoresEmbed] }).catch(console.error)
    console.log(`Edited message with ID: ${latestMessageID}`)
}

module.exports = updateGamesMessage;