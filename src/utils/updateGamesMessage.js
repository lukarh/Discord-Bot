const { EmbedBuilder } = require('discord.js')

const getJSON = require('./getJSON')

const teamEmojis = require(`../assets/teams/emojis.json`)
const teamColors = require(`../assets/teams/colors.json`)
const teamNicknames = require(`../assets/teams/nicknames.json`)
const broadcastEmojis = require(`../assets/broadcast-emojis.json`)

async function getBoxscoreJSON(gameID) {
    boxscoreJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameID}.json`)
    return boxscoreJSON
}

async function getAttendance(gameID) {
    boxscoreJSON = await getBoxscoreJSON(gameID)
    const attendance = boxscoreJSON.game.attendance
    return attendance
}

async function getOfficials(gameID) {
    boxscoreJSON = await getBoxscoreJSON(gameID)
    const officialsArray = boxscoreJSON.game.officials
    let officialsNames = []
    for (const official of officialsArray) {
        officialsNames.push(official.name)
    }
    return officialsNames
}

async function getPlayerLeadingStats(gameID, team) {
    boxscoreJSON = await getBoxscoreJSON(gameID)
    const teamPlayers = boxscoreJSON.game[team].players
    let leaderboard = {
            "pts_leader": {
                "name": "TBD",
                "points": 0
            },
            "rebs_leader": {
                "name": "TBD",
                "rebounds": 0
            },
            "asts_leader": {
                "name": "TBD",
                "assists": 0
            },
        }

    for (const player of teamPlayers) {
        if (player.statistics.points > leaderboard.pts_leader.points) {
            leaderboard.pts_leader.points = player.statistics.points
            leaderboard.pts_leader.name = player.nameI
        }
        if (player.statistics.reboundsTotal > leaderboard.rebs_leader.rebounds) {
            leaderboard.rebs_leader.rebounds = player.statistics.reboundsTotal
            leaderboard.rebs_leader.name = player.nameI
        }
        if (player.statistics.assists > leaderboard.asts_leader.assists) {
            leaderboard.asts_leader.assists = player.statistics.assists
            leaderboard.asts_leader.name = player.nameI
        }
    }

    return leaderboard
}

async function updateGamesMessage(client) {
    const channel = client.channels.cache.get(process.env.NBA_GAME_CHANNEL_ID)
    // const message = await channel.messages.fetch(process.env.TODAY_GAMES_MESSAGE_ID)
    const messageObjs = await channel.messages.fetch()
    const messageIDs = messageObjs.keys()
    const message = messageObjs.first()
    const latestMessageID = messageIDs.next().value
    // console.log('The latest Message ID:', latestMessageID, typeof latestMessageID)

    if (message) {
        const currentDateTimeStamp = new Date()
        const options = { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const currentHour = currentDateTimeStamp.getHours();
        const currentMinute = currentDateTimeStamp.getMinutes();
        const currentSecond = currentDateTimeStamp.getSeconds();

        const currentTime = `${currentHour}:${currentMinute}:${currentSecond}`

        console.log(`The current time: ${currentTime}`)

        const todayDate = currentDateTimeStamp.toLocaleString('en-US', options);

        // fetch league game schedule json from nba website
        scheduleJSON = await getJSON(`https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json`)
        const gameObjects = scheduleJSON.leagueSchedule.gameDates
        // fetch live league games from nba website
        scoreboardJSON = await getJSON(`https://nba-prod-us-east-1-mediaops-stats.s3.amazonaws.com/NBA/liveData/scoreboard/todaysScoreboard_00.json`)
        const liveGameObjects = scoreboardJSON.scoreboard.games
        // fetch live league game odds from nba website
        oddsJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/odds/odds_todaysGames.json`)
        const oddsObjects = oddsJSON.games

        const scoresEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Today's NBA Games - ${todayDate}`)
            .setDescription('\n=====================================================================')
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' });

        for (const gameObject of gameObjects) {
            let gameDate = gameObject.gameDate
            gameDate = gameDate.replace(' 00:00:00','')

            const games = gameObject.games
            if (gameDate === todayDate) {
                const games = gameObject.games
                for (const gameInfo of games) {

                    const gameID = gameInfo.gameId
                    const gameStatus = gameInfo.gameStatus // 1 - hasn't started, 2 - live, 3 - final
                    const gameStatusText = (gameStatus === 1) ? gameInfo.gameStatusText.replace(' pm', 'pm').replace(' am', 'am') : gameInfo.gameStatusText   

                    // fetch HOME & AWAY data
                    const homeTeamTricode = gameInfo.homeTeam.teamTricode
                    const awayTeamTricode = gameInfo.awayTeam.teamTricode

                    const homeScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID).homeTeam.score : gameInfo.homeTeam.score) 
                    const awayScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID).awayTeam.score : gameInfo.awayTeam.score)

                    const homeName = gameInfo.homeTeam.teamCity + ' ' + gameInfo.homeTeam.teamName 
                    const awayName = gameInfo.awayTeam.teamCity + ' ' + gameInfo.awayTeam.teamName

                    const homeRecord = gameInfo.homeTeam.wins + '-' + gameInfo.homeTeam.losses
                    const awayRecord = gameInfo.awayTeam.wins + '-' + gameInfo.awayTeam.losses

                    const arenaDetails = `**Arena:** ${gameInfo.arenaName}`
                    const broadcastEmoji = (gameInfo.broadcasters.nationalTvBroadcasters.length === 0) ? `${broadcastEmojis.LeaguePass}` : `${broadcastEmojis[gameInfo.broadcasters.nationalTvBroadcasters[0].broadcasterAbbreviation]}`

                    const gameScore = (gameStatus === 1) ? '**Score:** This game has not started yet.' : ((gameStatus === 2) ? `**Live Score:** ${awayScore}-${homeScore}` : `**Final Score:** ${awayScore}-${homeScore}`)

                    // if Playoff Game
                    if (gameInfo.seriesGameNumber !== '') {
                        const homeSeed = gameInfo.homeTeam.seed
                        const awaySeed = gameInfo.awayTeam.seed
                        const gameNumber = gameInfo.seriesGameNumber
                        const seriesText = gameInfo.seriesText

                        if ((gameStatus === 3) || (gameStatus === 2)) {

                            // const liveGameObject = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
                            // const gameTimeLeft = `**Time Left:** ${liveGameObject.gameStatusText}`

                            const homeLeaders = await getPlayerLeadingStats(gameID, "homeTeam")
                            const awayLeaders = await getPlayerLeadingStats(gameID, "awayTeam")
                            // const gameAttendance = `**Attendance: **` + await getAttendance(gameID)
                            const refereeNamesArray = await getOfficials(gameID)
                            const refereeNames = `**Referees: **` + refereeNamesArray.join(', ')

                            if (gameStatus === 2) {
                                const liveGameObject = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
                                const gameTimeLeft = `**Time Left:** ${liveGameObject.gameStatusText}`

                                scoresEmbed.addFields(
                                    {
                                        name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | Live :red_circle:`,
                                        value: `${gameTimeLeft} | ${gameScore} | ${arenaDetails} | **${seriesText}**
                                                ${refereeNames}`, 
                                    }
                                )
                            }

                            if (gameStatus === 3) {
                                
                                scoresEmbed.addFields(
                                    {
                                        name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | ${gameStatusText} :checkered_flag:`,
                                        value: `${gameScore} | ${arenaDetails} | ${seriesText}
                                                ${refereeNames}`, 
                                    }
                                )
                            }

                            scoresEmbed.addFields(
                                {            
                                    name: "---------------------------Player Stats Leader Board---------------------------",
                                    value: `**Pts:** ${homeLeaders.pts_leader.name} (${homeLeaders.pts_leader.points}) | **Rebs:** ${homeLeaders.rebs_leader.name} (${homeLeaders.rebs_leader.rebounds}) | **Asts:** ${homeLeaders.asts_leader.name} (${homeLeaders.asts_leader.assists})
                                            **Pts:** ${awayLeaders.pts_leader.name} (${awayLeaders.pts_leader.points}) | **Rebs:** ${awayLeaders.rebs_leader.name} (${awayLeaders.rebs_leader.rebounds}) | **Asts:** ${awayLeaders.asts_leader.name} (${awayLeaders.asts_leader.assists})
                                            =====================================================================`
                                }
                            )
                        } else {
                            scoresEmbed.addFields(
                                {
                                    name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | ${gameStatusText}`,
                                    value: `${gameScore} | ${arenaDetails} | **${seriesText}**
                                            =====================================================================`, 
                                }
                            )
                        }
                    // if Regular Season Game
                    } else {
                        const gameLink = gameInfo.branchLink

                        if (gameStatus === 3) {
                            scoresEmbed.addFields(
                                {
                                    name: `${teamEmojis[awayTeamTricode]} ${awayName} (${homeRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${awayRecord}) | ${gameStatusText}`,
                                    value: `**TV:** ${broadcastEmoji} | ${gameScore} | ${arenaDetails} | [View Full Boxscore](${gameLink}) \n **-------------------------------------------------**`, 
                                }
                            )
                        } else if (gameStatus === 2) {

                        } else {
                            scoresEmbed.addFields(
                                {
                                    name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${gameStatusText}`,
                                    value: `**TV:** ${broadcastEmoji} | ${gameScore} | ${arenaDetails} | **${seriesText}**`, 
                                }
                            )
                        }
                    } 

                    await message.edit({ embeds: [scoresEmbed] }).catch(console.error)
                    console.log(`Pinned mess with ID ${latestMessageID}`)
                }
            }
        }
    }
}

module.exports = updateGamesMessage;