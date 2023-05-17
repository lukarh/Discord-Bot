const getJSON = require('../../utils/getJSON')

const teamEmojis = require(`../../assets/teams/emojis.json`)
const teamColors = require(`../../assets/teams/colors.json`)
const teamNicknames = require(`../../assets/teams/nicknames.json`)
const broadcastEmojis = require(`../../assets/broadcast-emojis.json`)

const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'show-scores',
    description: 'Shows the either the score for current NBA Games or upcoming NBA games.',
    devOnly: false,

    callback: async (client, interaction) => {
        // fetch today's date in MM/DD/YYYY format
        const currentDateStamp = new Date()
        const options = { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        // const todayDate = currentDateStamp.toLocaleString('en-US', options);
        const todayDate = "02/15/2023"

        // fetch league game schedule json from nba website
        scheduleJSON = await getJSON(`https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json`)
        const gameObjects = scheduleJSON.leagueSchedule.gameDates
        // fetch live league games from nba website
        scoreboardJSON = await getJSON(`https://nba-prod-us-east-1-mediaops-stats.s3.amazonaws.com/NBA/liveData/scoreboard/todaysScoreboard_00.json`)
        const liveGameObjects = scoreboardJSON.scoreboard.games
        // fetch live league game odds from nba website
        oddsJSON = await getJSON(`https://cdn.nba.com/static/json/liveData/odds/odds_todaysGames.json`)
        // console.log(oddsJSON)
        const oddsObjects = oddsJSON.games

        const scoresEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Today's NBA Games - ${todayDate}`)
            .setDescription('\n**-------------------------------------------------**')
            .setFooter({ text: 'A NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' });

        for (const gameObject of gameObjects) {
            let gameDate = gameObject.gameDate
            gameDate = gameDate.replace(' 00:00:00','')

            const games = gameObject.games
            if (gameDate === todayDate) {
                const games = gameObject.games
                for (const gameInfo of games) {
                    const gameStatus = gameInfo.gameStatus // 1 - hasn't started, 2 - live, 3 - final
                    const gameStatusText = (gameStatus === 1) ? gameInfo.gameStatusText.replace(' pm', 'pm').replace(' am', 'am') : gameInfo.gameStatusText   

                    // fetch HOME & AWAY data
                    const homeTeamTricode = gameInfo.homeTeam.teamTricode
                    const awayTeamTricode = gameInfo.awayTeam.teamTricode

                    const homeScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? 10 : gameInfo.homeTeam.score) 
                    const awayScore = (gameStatus === 1) ? 0 : ((gameStatus === 2) ? 10 : gameInfo.awayTeam.score)

                    const homeName = gameInfo.homeTeam.teamCity + ' ' + gameInfo.homeTeam.teamName 
                    const awayName = gameInfo.awayTeam.teamCity + ' ' + gameInfo.awayTeam.teamName

                    const homeRecord = gameInfo.homeTeam.wins + '-' + gameInfo.homeTeam.losses
                    const awayRecord = gameInfo.awayTeam.wins + '-' + gameInfo.awayTeam.losses

                    const arenaDetails = `**Arena:** ${gameInfo.arenaName}`
                    const broadcastEmoji = (gameInfo.broadcasters.nationalTvBroadcasters.length === 0) ? `${broadcastEmojis.LeaguePass}` : `${broadcastEmojis[gameInfo.broadcasters.nationalTvBroadcasters[0].broadcasterAbbreviation]}`

                    const gameScore = (gameStatus === 1) ? '**Score:** This game has not started yet.' : ((gameStatus === 2) ? `**Live Score:** ${awayScore}-${homeScore}` : `**Final Score:** ${awayScore}-${homeScore}`)
                    const gameLink = gameInfo.branchLink

                    // if Playoff Game
                    if (gameInfo.seriesGameNumber !== '') {
                        const homeSeed = gameInfo.homeTeam.seed
                        const awaySeed = gameInfo.awayTeam.seed
                        const gameNumber = gameInfo.seriesGameNumber
                        const seriesText = gameInfo.seriesText

                        if (gameStatus === 3) {
                            scoresEmbed.addFields(
                                {
                                    name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | ${gameStatusText}`,
                                    value: `${gameScore} | ${arenaDetails} | **${seriesText}**`, 
                                }
                            )
                        } else if (gameStatus === 2) {

                        } else { 
                            scoresEmbed.addFields(
                                {
                                    name: `${teamEmojis[awayTeamTricode]} ${awayName} (${awaySeed}) @ ${teamEmojis[homeTeamTricode]} ${homeName} (${homeSeed}) | ${gameNumber} | ${broadcastEmoji} | ${gameStatusText}`,
                                    value: `${gameScore} | ${arenaDetails} | **${seriesText}**`, 
                                }
                            )
                        }
                    // if Regular Season Game
                    } else {
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
                }
            }
        }

        // const scoresEmbed = new EmbedBuilder()
        //     .setTitle(`${teamEmojis.NBA} Today's NBA Games`)
        //     .setDescription("This is an embed")
        //     .setColor(`${teamColors.NBA}`) // 0x[hexcode]
        //     .addFields(
        //         { 
        //             name: 'Field title', 
        //             value: 'Some random value',
        //             inline: true,
        //         },
        //         { 
        //             name: '2nd Field title', 
        //             value: 'Some random value',
        //             inline: true,
        //         },
        //         { 
        //             name: '3rd Field title', 
        //             value: 'Some random value',
        //             inline: true,
        //         },
        //     )
                
        interaction.reply({ embeds: [scoresEmbed] });
        // interaction.reply(`Today's Date is ${todayDate}`)
    }

}