const { EmbedBuilder } = require('discord.js')

const teamEmojis = require(`../assets/teams/emojis.json`)
const teamColors = require(`../assets/teams/colors.json`)
const broadcastEmojis = require(`../assets/broadcast-emojis.json`)

const { getReferees, getPlayerLeadingStats, getGameOdds } = require(`./getLiveNBAData`)

async function addBasicGameDetailsRSToEmbed(gameStatus, gameInfo, scoresEmbed,
    homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
    gameStatusText, gameOddsText, refereeNames, arenaDetails, broadcastEmoji
) {
    const homeRecord = gameInfo.homeTeam.wins + '-' + gameInfo.homeTeam.losses
    const awayRecord = gameInfo.awayTeam.wins + '-' + gameInfo.awayTeam.losses
    const gameLink = gameInfo.branchLink

    if (gameStatus === 1) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awayRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeRecord}) | ${broadcastEmoji} | ${gameStatusText}`,
                value: `${gameScore} | ${arenaDetails}
${gameOddsText}
=====================================================================`, 
            }
        )
    } else if (gameStatus === 2) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awayRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeRecord}) | ${broadcastEmoji} | ${gameStatusText} | Live :red_circle:`,
                value: `${gameTimeLeft} | ${gameScore} | ${arenaDetails}
${refereeNames} 
${gameOddsText}`, 
            }
        )
    } else if (gameStatus === 3) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awayRecord}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeRecord}) | ${broadcastEmoji} | ${gameStatusText} :checkered_flag:`,
                value: `${gameScore} | ${arenaDetails} | [View Full Boxscore](${gameLink})
${refereeNames}`, 
            }
        )
    }
}  

async function addBasicGameDetailsPlayoffsToEmbed(gameStatus, gameInfo, scoresEmbed,
    homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
    gameStatusText, gameOddsText, refereeNames, arenaDetails, broadcastEmoji
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
${gameOddsText}
=====================================================================`, 
            }
        )
    } else if (gameStatus === 2) {
        scoresEmbed.addFields(
            {
                name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | Live :red_circle:`,
                value: `${gameTimeLeft} | ${gameScore} | ${arenaDetails} | ${seriesText}
${refereeNames} 
${gameOddsText}`, 
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

async function addPlayerLeaderboardToEmbed(gameID, scoresEmbed, homeTeamTricode, awayTeamTricode) { 
    const homeLeaders = await getPlayerLeadingStats(gameID, "homeTeam")
    const awayLeaders = await getPlayerLeadingStats(gameID, "awayTeam")

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

async function addGameColorToEmbed(gameInfo, scoresEmbed) {
    scoresEmbed.setColor(`${teamColors[gameInfo.homeTeam.teamTricode]}`)
}

async function addGameDetailsToEmbed(gameStatus, gameInfo, liveGameInfo, gameID, gameOddsInfo, scoresEmbed) {
    const gameStatusText = (gameStatus === 1) ? gameInfo.gameStatusText.replace(' pm', 'pm').replace(' am', 'am') : gameInfo.gameStatusText   

    const homeTeamTricode = gameInfo.homeTeam.teamTricode
    const awayTeamTricode = gameInfo.awayTeam.teamTricode

    const gameOdds = await getGameOdds(gameOddsInfo)

    const homeScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? liveGameInfo.homeTeam.score : gameInfo.homeTeam.score) 
    const awayScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? liveGameInfo.awayTeam.score : gameInfo.awayTeam.score)

    const homeName = gameInfo.homeTeam.teamCity + ' ' + gameInfo.homeTeam.teamName 
    const awayName = gameInfo.awayTeam.teamCity + ' ' + gameInfo.awayTeam.teamName

    const refereeNames = (gameStatus !== 1) ? await getReferees(gameID) : ['N/A']
    const gameTimeLeft = (liveGameInfo !== undefined) ? `**Time Left:** ${liveGameInfo.gameStatusText}` : `N/A`

    const arenaDetails = `**Arena:** ${gameInfo.arenaName}`
    const broadcastEmoji = (gameInfo.broadcasters.nationalTvBroadcasters.length === 0) ? `${broadcastEmojis.LeaguePass}` : `${broadcastEmojis[gameInfo.broadcasters.nationalTvBroadcasters[0].broadcasterAbbreviation]}`

    const gameScore = (gameStatus === 1) ? '**Score:** This game has not started yet.' : ((gameStatus === 2) ? `**Live Score:** ${awayScore}-${homeScore}` : `**Final Score:** ${awayScore}-${homeScore}`)

    const gameOddsText = (gameOdds !== undefined) ? `**[Home]** **Opening Spread:** ${gameOdds.outcomes[0].opening_spread} | **Current Spread:** ${gameOdds.outcomes[0].spread} :left_right_arrow: | Presented by: ${broadcastEmojis.FanDuel}` : ``

    if (gameInfo.seriesGameNumber !== '') { 
        await addBasicGameDetailsPlayoffsToEmbed(gameStatus, gameInfo, scoresEmbed,
            homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
            gameStatusText, gameOddsText, refereeNames, arenaDetails, broadcastEmoji
            )
    } else {
        await addBasicGameDetailsRSToEmbed(gameStatus, gameInfo, scoresEmbed,
            homeName, awayName, homeTeamTricode, awayTeamTricode, gameScore, gameStatusText, gameTimeLeft, 
            gameStatusText, gameOddsText, refereeNames, arenaDetails, broadcastEmoji
            )
    }
    if ((gameStatus == 2) || (gameStatus == 3)) {
        await addPlayerLeaderboardToEmbed(gameID, scoresEmbed, homeTeamTricode, awayTeamTricode)
    }
}

async function addNoGamesDetailToEmbed(scoresEmbed) {
    scoresEmbed.addFields(
        {
            name: `:no_entry_sign: There are no NBA games scheduled for today. :no_entry_sign:`,
            value: `=====================================================================`, 
        }
    )
} 

async function createGameScoreEmbed(todayDate, currentTime) {

    const scoresEmbed = new EmbedBuilder()
        .setTitle(`${teamEmojis.NBA} Live NBA Game Channel - ${todayDate} | Last Update: ${currentTime} :arrows_counterclockwise:`)
        .setDescription('\n=====================================================================')
        .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' })
    
    return scoresEmbed
}

module.exports = {
    createGameScoreEmbed,
    addGameColorToEmbed,
    addGameDetailsToEmbed,
    addNoGamesDetailToEmbed
}

