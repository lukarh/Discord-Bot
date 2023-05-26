const getJSON = require('./getJSON')
const broadcastEmojis = require(`../assets/broadcast-emojis.json`)

async function getBoxscore(gameID) {
    try { 
        boxscoreJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameID}.json`)
        return boxscoreJSON
    } catch (error) {
        console.error('No BoxscoreJSON associated at the moment with the following Game ID:', gameID)
        return undefined
    }
}

async function getReferees(gameID) {
    boxscoreJSON = await getBoxscore(gameID)
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
    boxscoreJSON = await getBoxscore(gameID)

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

async function getSchedule(rawJSON=true) {
    try { 
        scheduleJSON = await getJSON(`https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json`)
        if (rawJSON) {
            return scheduleJSON
        } else {
            const gameObjects = scheduleJSON.leagueSchedule.gameDates
            return gameObjects
        }
    } catch (error) {
        console.error('No ScheduleJSON available at the moment.')
        return undefined
    }
}

async function getTodaysGames(todaysDate) {
    gameObjects = await getSchedule(rawJSON=false)
    const todaysGamesObj = gameObjects.find(gameObject => gameObject.gameDate.replace(' 00:00:00','') === todaysDate)
    try {
        const todaysGames = todaysGamesObj.games
        return todaysGames
    } catch (error) {
        console.log(`There are no NBA games found for today: ${todaysDate}`)
        return undefined
    }
}

async function getHomeAndAwayTeam(gameID) {
    gameObjects = await getSchedule(rawJSON=false) 
    gamesArray = []
    for (const gamesObject of gameObjects) {
        games = gamesObject.games
        gamesArray.push(...games)
    }
    gameInfo = gamesArray.find(gamesInfo => parseInt(gamesInfo.gameId) === parseInt(gameID))
    return { 
        homeTeam: gameInfo.homeTeam.teamTricode, awayTeam: gameInfo.awayTeam.teamTricode, 
    }
}

async function getGameDetails(gameID) {
    gameObjects = await getSchedule(rawJSON=false) 
    gamesArray = []
    for (const gamesObject of gameObjects) {
        games = gamesObject.games
        gamesArray.push(...games)
    }
    gameInfo = gamesArray.find(gamesInfo => parseInt(gamesInfo.gameId) === parseInt(gameID))

    return { 
        gameStatus: gameInfo.gameStatus,
        homeRecord: gameInfo.homeTeam.wins + '-' + gameInfo.homeTeam.losses,
        awayRecord: gameInfo.awayTeam.wins + '-' + gameInfo.awayTeam.losses,
        broadcastEmoji: (gameInfo.broadcasters.nationalTvBroadcasters.length === 0) ? `${broadcastEmojis.LeaguePass}` : `${broadcastEmojis[gameInfo.broadcasters.nationalTvBroadcasters[0].broadcasterAbbreviation]}`,
        arenaName: gameInfo.arenaName,
        gameTime: (parseInt(gameInfo.gameStatus) === 1) ? gameInfo.gameStatusText.replace(' pm', 'pm').replace(' am', 'am') : gameInfo.gameStatusText,
        gameDate: new Date(gameInfo.gameDateEst).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        }),
        gameID: gameInfo.gameId,
        homeTeamTricode: gameInfo.homeTeam.teamTricode,
        awayTeamTricode: gameInfo.awayTeam.teamTricode,
    }
}

async function getScoreboard(rawJSON=true) {
    try { 
        scoreboardJSON = await getJSON(`https://nba-prod-us-east-1-mediaops-stats.s3.amazonaws.com/NBA/liveData/scoreboard/todaysScoreboard_00.json`)
        if (rawJSON) {
            return scoreboardJSON
        } else {
            const liveGameObjects = scoreboardJSON.scoreboard.games
            return liveGameObjects
        }
    } catch (error) {
        console.error('No ScoreboardJSON available at the moment.')
        return undefined
    }
}

async function getTodaysOdds(rawJSON=true) {
    try { 
        oddsJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/odds/odds_todaysGames.json`)
        if (rawJSON) {
            return oddsJSON
        } else {
            const oddsObjects = oddsJSON.games
            return oddsObjects
        }
    } catch (error) {
        console.error('No OddsJSON available at the moment.')
        return undefined
    }
}

async function getGameOdds(gameOddsInfo) {
    try {
        gameOdds = gameOddsInfo.markets[1].books.find(betBookObj => betBookObj.name === 'FanDuel')
        return gameOdds
    } catch (error) {
        return undefined
    }
}

module.exports = {
    getReferees,
    getPlayerLeadingStats,
    getBoxscore,
    getGameOdds,
    getGameDetails,
    getScoreboard,
    getSchedule,
    getTodaysGames,
    getTodaysOdds,
    getHomeAndAwayTeam,
}