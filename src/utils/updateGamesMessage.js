const { EmbedBuilder } = require('discord.js')

const getJSON = require('./getJSON')

const teamEmojis = require(`../assets/teams/emojis.json`)
const teamColors = require(`../assets/teams/colors.json`)
const teamNicknames = require(`../assets/teams/nicknames.json`)
const broadcastEmojis = require(`../assets/broadcast-emojis.json`)

async function getCurrentTime() {
    const currentDateTimeStamp = new Date()
    let currentHour = currentDateTimeStamp.getHours();
    const currentMinute = currentDateTimeStamp.getMinutes().toString().padStart(2, '0');

    let period = 'AM';

    if (currentHour === 0) {
        currentHour = 12;
    } else if (currentHour > 12) {
        currentHour %= 12;
        period = 'PM';
    }

    const currentTime = `${currentHour}:${currentMinute}${period}`

    return currentTime
}

async function getBoxscoreJSON(gameID) {
    try { 
        boxscoreJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameID}.json`)
        return boxscoreJSON
    } catch (error) {
        console.error('No BoxscoreJSON assocaited with this gameID yet:', gameID)
        return undefined
    }
}

async function getAttendance(gameID) {
    boxscoreJSON = await getBoxscoreJSON(gameID)
    const attendance = boxscoreJSON.game.attendance
    return attendance
}

async function getReferees(gameID) {
    boxscoreJSON = await getBoxscoreJSON(gameID)
    if (boxscoreJSON !== undefined) {
        const refereesInfoArray = boxscoreJSON.game.officials
        let refereeNamesArray = []
        for (const referee of refereesInfoArray) {
            refereeNamesArray.push(referee.name)
        }
        const refereeNames = `**Referees: **` + refereeNamesArray.join(', ')
        return refereeNames
    } else {
        return []
    }
}

async function getPlayerLeadingStats(gameID, team) {
    boxscoreJSON = await getBoxscoreJSON(gameID)

    const teamPlayers = boxscoreJSON.game[team].players
    let leaderboard = {
            "ptsLeader": {
                "name": "---",
                "points": 0
            },
            "rebsLeader": {
                "name": "---",
                "reboundsTotal": 0
            },
            "astsLeader": {
                "name": "---",
                "assists": 0
            },
            "stlsLeader": {
                "name": "---",
                "steals": 0,
            },
            "blksLeader": {
                "name": "---",
                "blocks": 0,
            },
            "foulsLeader": {
                "name": "---",
                "foulsPersonal": 0,
            },
            "paintPtsLeader": {
                "name": "---",
                "pointsInThePaint": 0,
            },
            "fastbreakPtsLeader": {
                "name": "---",
                "pointsFastBreak": 0,
            },
            "secondsPtsLeader": {
                "name": "---",
                "pointsSecondChance": 0,
            },
            "threesLeader": {
                "name": "---",
                "threePointersMade": 0,
            },
            "threesALeader": {
                "name": "---",
                "threePointersAttempted": 0,
            },
            "fgmLeader": {
                "name": "---",
                "fieldGoalsMade": 0,
            },
            "fgaLeader": {
                "name": "---",
                "fieldGoalsAttempted": 0,
            },
            "toLeader": {
                "name": "---",
                "turnovers": 0,
            },
            "ftmLeader": {
                "name": "---",
                "freeThrowsMade": 0,
            },
            "ftaLeader": {
                "name": "---",
                "freeThrowsAttempted": 0,
            }
        }

    for (const player of teamPlayers) {
        if (player.statistics.points > leaderboard.ptsLeader.points) {
            leaderboard.ptsLeader.points = player.statistics.points
            leaderboard.ptsLeader.name = player.nameI
        }
        if (player.statistics.reboundsTotal > leaderboard.rebsLeader.reboundsTotal) {
            leaderboard.rebsLeader.reboundsTotal = player.statistics.reboundsTotal
            leaderboard.rebsLeader.name = player.nameI
        }
        if (player.statistics.assists > leaderboard.astsLeader.assists) {
            leaderboard.astsLeader.assists = player.statistics.assists
            leaderboard.astsLeader.name = player.nameI
        }
        if (player.statistics.steals > leaderboard.stlsLeader.steals) {
            leaderboard.stlsLeader.steals = player.statistics.steals
            leaderboard.stlsLeader.name = player.nameI
        }
        if (player.statistics.blocks > leaderboard.blksLeader.blocks) {
            leaderboard.blksLeader.blocks = player.statistics.blocks
            leaderboard.blksLeader.name = player.nameI
        }
        if (player.statistics.foulsPersonal > leaderboard.foulsLeader.foulsPersonal) {
            leaderboard.foulsLeader.foulsPersonal = player.statistics.foulsPersonal
            leaderboard.foulsLeader.name = player.nameI
        }
        if (player.statistics.pointsInThePaint > leaderboard.paintPtsLeader.pointsInThePaint) {
            leaderboard.paintPtsLeader.pointsInThePaint = player.statistics.pointsInThePaint
            leaderboard.paintPtsLeader.name = player.nameI
        }
        if (player.statistics.pointsFastBreak > leaderboard.fastbreakPtsLeader.pointsFastBreak) {
            leaderboard.fastbreakPtsLeader.pointsFastBreak = player.statistics.pointsFastBreak
            leaderboard.fastbreakPtsLeader.name = player.nameI
        }
        // if (player.statistics.threePointersMade > leaderboard.threesLeader.threePointersMade) {
        //     leaderboard.threesLeader.threePointersMade = player.statistics.threePointersMade
        //     leaderboard.threesLeader.name = player.nameI
        // }
        if (player.statistics.threePointersAttempted > leaderboard.threesALeader.threePointersAttempted) {
            leaderboard.threesLeader.threePointersMade = player.statistics.threePointersMade
            leaderboard.threesALeader.threePointersAttempted = player.statistics.threePointersAttempted
            leaderboard.threesALeader.name = player.nameI
        }
        // if (player.statistics.fieldGoalsMade > leaderboard.fgmLeader.fieldGoalsMade) {
        //     leaderboard.fgmLeader.fieldGoalsMade = player.statistics.fieldGoalsMade
        //     leaderboard.fgmLeader.name = player.nameI
        // }
        if (player.statistics.fieldGoalsAttempted > leaderboard.fgaLeader.fieldGoalsAttempted) {
            leaderboard.fgmLeader.fieldGoalsMade = player.statistics.fieldGoalsMade
            leaderboard.fgaLeader.fieldGoalsAttempted = player.statistics.fieldGoalsAttempted
            leaderboard.fgaLeader.name = player.nameI
        }
        if (player.statistics.turnovers > leaderboard.toLeader.turnovers) {
            leaderboard.toLeader.turnovers = player.statistics.turnovers
            leaderboard.toLeader.name = player.nameI
        }
        if (player.statistics.pointsSecondChance > leaderboard.secondsPtsLeader.pointsSecondChance) {
            leaderboard.secondsPtsLeader.pointsSecondChance = player.statistics.pointsSecondChance
            leaderboard.secondsPtsLeader.name = player.nameI
        }
        // if (player.statistics.freeThrowsMade > leaderboard.ftmLeader.freeThrowsMade) {
        //     leaderboard.ftmLeader.freeThrowsMade = player.statistics.freeThrowsMade
        //     leaderboard.ftmLeader.name = player.nameI
        // }
        if (player.statistics.freeThrowsAttempted > leaderboard.ftaLeader.freeThrowsAttempted) {
            leaderboard.ftmLeader.freeThrowsMade = player.statistics.freeThrowsMade
            leaderboard.ftaLeader.freeThrowsAttempted = player.statistics.freeThrowsAttempted
            leaderboard.ftaLeader.name = player.nameI
        }
    }

    return leaderboard
}

async function addBasicGameDetailsRSToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, scoresEmbed,
    homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
    gameStatusText, refereeNames, arenaDetails, broadcastEmoji
) {
    const homeRecord = gameInfo.homeTeam.wins + '-' + gameInfo.homeTeam.losses
    const awayRecord = gameInfo.awayTeam.wins + '-' + gameInfo.awayTeam.losses


    if (gameStatus === 1) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awayRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeRecord}) | ${broadcastEmoji} | ${gameStatusText}`,
                value: `${gameScore} | ${arenaDetails}`, 
            }
        )
    } else if (gameStatus === 2) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awayRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeRecord}) | ${broadcastEmoji} | ${gameStatusText} | Live :red_circle:`,
                value: `${gameTimeLeft} | ${gameScore} | ${arenaDetails}
                        ${refereeNames}`, 
            }
        )
    } else if (gameStatus === 3) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awayRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeRecord}) | ${broadcastEmoji} | ${gameStatusText} :checkered_flag:`,
                value: `${gameScore} | ${arenaDetails} | [View Full Boxscore](${gameLink}) \n **-------------------------------------------------**`, 
            }
        )
    }
}  

async function addBasicGameDetailsPlayoffsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, scoresEmbed,
    homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
    gameStatusText, refereeNames, arenaDetails, broadcastEmoji
) {

    const homeSeed = gameInfo.homeTeam.seed
    const awaySeed = gameInfo.awayTeam.seed
    const gameNumber = gameInfo.seriesGameNumber
    const seriesText = gameInfo.seriesText

    if (gameStatus === 1) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | ${gameStatusText}`,
                value: `${gameScore} | ${arenaDetails} | ${seriesText}
                        =====================================================================`, 
            }
        )
    } else if (gameStatus === 2) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | Live :red_circle:`,
                value: `${gameTimeLeft} | ${gameScore} | ${arenaDetails} | ${seriesText}
                        ${refereeNames}`, 
            }
        )
    } else if (gameStatus === 3) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | ${gameStatusText} :checkered_flag:`,
                value: `${gameScore} | ${arenaDetails} | ${seriesText}
                        ${refereeNames}`, 
            }
        )
    }
}  

async function addPlayerLeaderboardToEmbed(gameInfo, gameID, scoresEmbed, homeTeamTricode, awayTeamTricode) { 
    const homeLeaders = await getPlayerLeadingStats(gameID, "homeTeam")
    const awayLeaders = await getPlayerLeadingStats(gameID, "awayTeam")
    // const gameAttendance = `**Attendance: **` + await getAttendance(gameID)

    scoresEmbed.addFields(
        {            
            name: "---------------------------Player Stats Leaderboard---------------------------",
            value: `**${teamEmojis[homeTeamTricode]} Pts:** ${homeLeaders.ptsLeader.name} (${homeLeaders.ptsLeader.points}) | **Rebs:** ${homeLeaders.rebsLeader.name} (${homeLeaders.rebsLeader.reboundsTotal}) | **Asts:** ${homeLeaders.astsLeader.name} (${homeLeaders.astsLeader.assists})
                    **${teamEmojis[awayTeamTricode]} Pts:** ${awayLeaders.ptsLeader.name} (${awayLeaders.ptsLeader.points}) | **Rebs:** ${awayLeaders.rebsLeader.name} (${awayLeaders.rebsLeader.reboundsTotal}) | **Asts:** ${awayLeaders.astsLeader.name} (${awayLeaders.astsLeader.assists})
                    **${teamEmojis[homeTeamTricode]} Stls:** ${homeLeaders.stlsLeader.name} (${homeLeaders.stlsLeader.steals}) | **Blks:** ${homeLeaders.blksLeader.name} (${homeLeaders.blksLeader.blocks}) | **TOs:** ${homeLeaders.toLeader.name} (${homeLeaders.toLeader.turnovers})
                    **${teamEmojis[awayTeamTricode]} Stls:** ${awayLeaders.stlsLeader.name} (${awayLeaders.stlsLeader.steals}) | **Blks:** ${awayLeaders.blksLeader.name} (${awayLeaders.blksLeader.blocks}) | **TOs:** ${awayLeaders.toLeader.name} (${awayLeaders.toLeader.turnovers})
                    `
        }
    )
    scoresEmbed.addFields(
        {            
            name: "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
            value: `**${teamEmojis[homeTeamTricode]} FGA:** ${homeLeaders.fgaLeader.name} (${homeLeaders.fgmLeader.fieldGoalsMade}/${homeLeaders.fgaLeader.fieldGoalsAttempted}) | **FTA:** ${homeLeaders.ftaLeader.name} (${homeLeaders.ftmLeader.freeThrowsMade}/${homeLeaders.ftaLeader.freeThrowsAttempted}) | **3PM:** ${homeLeaders.threesALeader.name} (${homeLeaders.threesLeader.threePointersMade}/${homeLeaders.threesALeader.threePointersAttempted})
                    **${teamEmojis[awayTeamTricode]} FGA:** ${awayLeaders.fgaLeader.name} (${awayLeaders.fgmLeader.fieldGoalsMade}/${awayLeaders.fgaLeader.fieldGoalsAttempted}) | **FTA:** ${awayLeaders.ftaLeader.name} (${awayLeaders.ftmLeader.freeThrowsMade}/${awayLeaders.ftaLeader.freeThrowsAttempted}) | **3PM:** ${awayLeaders.threesALeader.name} (${awayLeaders.threesLeader.threePointersMade}/${awayLeaders.threesALeader.threePointersAttempted})
                    **${teamEmojis[homeTeamTricode]} Paint Pts:** ${homeLeaders.paintPtsLeader.name} (${homeLeaders.paintPtsLeader.pointsInThePaint}) | **FB Pts:** ${homeLeaders.fastbreakPtsLeader.name} (${homeLeaders.fastbreakPtsLeader.pointsFastBreak}) | **2ndC Pts:** ${homeLeaders.secondsPtsLeader.name} (${homeLeaders.secondsPtsLeader.pointsSecondChance})
                    **${teamEmojis[awayTeamTricode]} Paint Pts:** ${awayLeaders.paintPtsLeader.name} (${awayLeaders.paintPtsLeader.pointsInThePaint}) | **FB Pts:** ${awayLeaders.fastbreakPtsLeader.name} (${awayLeaders.fastbreakPtsLeader.pointsFastBreak}) | **2ndC Pts:** ${awayLeaders.secondsPtsLeader.name} (${awayLeaders.secondsPtsLeader.pointsSecondChance})
                    =====================================================================`
        }
    )
    
}

async function addGameDetailsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, scoresEmbed) {
    const gameStatusText = (gameStatus === 1) ? gameInfo.gameStatusText.replace(' pm', 'pm').replace(' am', 'am') : gameInfo.gameStatusText   

    const homeTeamTricode = gameInfo.homeTeam.teamTricode
    const awayTeamTricode = gameInfo.awayTeam.teamTricode

    const homeScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? liveGameInfo.homeTeam.score : gameInfo.homeTeam.score) 
    const awayScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? liveGameInfo.awayTeam.score : gameInfo.awayTeam.score)

    const homeName = gameInfo.homeTeam.teamCity + ' ' + gameInfo.homeTeam.teamName 
    const awayName = gameInfo.awayTeam.teamCity + ' ' + gameInfo.awayTeam.teamName

    const refereeNames = await getReferees(gameID)
    const gameTimeLeft = (liveGameInfo !== undefined) ? `**Time Left:** ${liveGameInfo.gameStatusText}` : `N/A`

    const arenaDetails = `**Arena:** ${gameInfo.arenaName}`
    const broadcastEmoji = (gameInfo.broadcasters.nationalTvBroadcasters.length === 0) ? `${broadcastEmojis.LeaguePass}` : `${broadcastEmojis[gameInfo.broadcasters.nationalTvBroadcasters[0].broadcasterAbbreviation]}`

    const gameScore = (gameStatus === 1) ? '**Score:** This game has not started yet.' : ((gameStatus === 2) ? `**Live Score:** ${awayScore}-${homeScore}` : `**Final Score:** ${awayScore}-${homeScore}`)

    if (gameInfo.seriesGameNumber !== '') { 
        await addBasicGameDetailsPlayoffsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, scoresEmbed,
            homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
            gameStatusText, refereeNames, arenaDetails, broadcastEmoji
            )
    } else {
        await addBasicGameDetailsRSToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, scoresEmbed,
            homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
            gameStatusText, refereeNames, arenaDetails, broadcastEmoji
            )
    }
    if ((gameStatus == 2) || (gameStatus == 3)) {
        await addPlayerLeaderboardToEmbed(gameInfo, gameID, scoresEmbed, homeTeamTricode, awayTeamTricode)
    }
}

async function updateGamesMessage(client) {
    const channel = client.channels.cache.get(process.env.NBA_GAME_CHANNEL_ID)
    const messageObjs = await channel.messages.fetch()
    const messageIDs = messageObjs.keys()
    const message = messageObjs.first()

    const latestMessageID = messageIDs.next().value

    if (message) {
        // fetch current date and time
        const currentDateTimeStamp = new Date()
        const options = { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const todayDate = currentDateTimeStamp.toLocaleString('en-US', options);
        // const todayDate = '05/18/2023'
        const currentTime = await getCurrentTime()

        // fetch league game schedule json from nba website
        scheduleJSON = await getJSON(`https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json`)
        const gameObjects = scheduleJSON.leagueSchedule.gameDates
        // fetch live league games from nba website
        scoreboardJSON = await getJSON(`https://nba-prod-us-east-1-mediaops-stats.s3.amazonaws.com/NBA/liveData/scoreboard/todaysScoreboard_00.json`)
        const liveGameObjects = scoreboardJSON.scoreboard.games
        // fetch live league game odds from nba website
        oddsJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/odds/odds_todaysGames.json`)
        const oddsObjects = oddsJSON.games
        // create scoresEmbed
        const scoresEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Live NBA Game Channel - ${todayDate} | Last Update: ${currentTime} :arrows_counterclockwise:`)
            .setDescription('\n=====================================================================')
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' });

        const todaysGames = gameObjects.find(gameObject => gameObject.gameDate.replace(' 00:00:00','') === todayDate)
 
        // check if there are any NBA games scheduled for today
        if (todaysGames !== undefined) {
            const games = todaysGames.games

            for (const gameInfo of games) {

                const gameID = gameInfo.gameId
                const liveGameInfo = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)

                let gameStatus = gameInfo.gameStatus // 1 - hasn't started, 2 - live, 3 - final
                gameStatus = (liveGameInfo !== undefined) ? liveGameInfo.gameStatus : gameStatus

                await addGameDetailsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, scoresEmbed)

                await message.edit({ embeds: [scoresEmbed] }).catch(console.error)
                console.log(`Pinned mess with ID ${latestMessageID}`)
            }
        // other there are no games for today
        } else {
            scoresEmbed.addFields(
                {
                    name: `:no_entry_sign: There are no NBA games scheduled for today. :no_entry_sign:`,
                    value: `=====================================================================`, 
                }
            )
        }
    }
}

module.exports = updateGamesMessage;