const teamEmojis = require(`../../assets/teams/emojis.json`)
const teamColors = require(`../../assets/teams/colors.json`)
const teamFullNames = require(`../../assets/teams/full-names.json`);
const broadcastEmojis = require(`../../assets/broadcast-emojis.json`)

const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { getCurrentDateTime } = require('../../utils/getCurrentDateTime')
const { getScoreboard, getTodaysOdds, getGameOdds, getGameDetails, getHomeAndAwayTeam } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'available-game-bets',
    description: "Get a list of current games that can be bet on.",
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        await interaction.deferReply()

        timeResults = await getCurrentDateTime()

        // write command logic here...
        const betsEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Betting Status of Available NBA Games | Fetched @ ${timeResults.currentTime} :arrows_counterclockwise:`)
            .setDescription(`=====================================================================`)
            .setColor(`#ffd700`)

        // fetch odds for today's games and check if bets are available today
        const availableGameOdds = await getTodaysOdds(rawJSON=false)

        // if no games, return no available games to bet on
        if (availableGameOdds === undefined) {
            betsEmbed.addFields(
                {
                    name: `:no_entry_sign: There are no NBA games scheduled to bet on today. :no_entry_sign:`,
                    value: `=====================================================================`, 
                }
            )
            interaction.editReply({ embeds: [betsEmbed] })
            return
        }

        // fetch league schedule and current live games to check for current game status
        const liveGameObjects = await getScoreboard(rawJSON=false)

        // loop through games with odds
        for (const gameInfo of availableGameOdds) {
            // fetch gameID and gameOdds of the game
            const gameID = gameInfo.gameId
            const gameOdds = await getGameOdds(gameInfo)

            const liveGameInfo = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
            const gameDetails = await getGameDetails(gameID)
            const gameStatus = (liveGameInfo !== undefined) ? liveGameInfo.gameStatus : gameDetails.gameStatus
            const teamResults = await getHomeAndAwayTeam(gameID)

            // fetch and calculate odds for the games
            const homeOpeningMoneyLine = (-100 / (parseFloat(gameOdds.outcomes[0].opening_odds) - 1)).toFixed(0)
            const homeCurrentMoneyLine = (-100 / (parseFloat(gameOdds.outcomes[0].odds) - 1)).toFixed(0)

            const awayOpeningMoneyLine = (-100 / (parseFloat(gameOdds.outcomes[1].opening_odds) - 1)).toFixed(0)
            const awayCurrentMoneyLine = (-100 / (parseFloat(gameOdds.outcomes[1].odds) - 1)).toFixed(0)

            const homeOpenSpread = gameOdds.outcomes[0].opening_spread
            const homeCurrentSpread = gameOdds.outcomes[0].spread

            const awayOpenSpread = gameOdds.outcomes[1].opening_spread
            const awayCurrentSpread = gameOdds.outcomes[1].spread

            // check and show status of each game
            if (gameStatus === 1) {
                betsEmbed.addFields(
                    {
                        name: `${teamEmojis[teamResults.awayTeam]} ${teamFullNames[teamResults.awayTeam]} (${gameDetails.awayRecord}) @ ${teamEmojis[teamResults.homeTeam]} ${teamFullNames[teamResults.homeTeam]} (${gameDetails.homeRecord}) | ${gameDetails.broadcastEmoji} | ${gameDetails.gameTime} | ${gameDetails.gameDate}`,
                        value: `:game_die: **Bets:** Open :unlock: | **Arena:** ${gameDetails.arenaName} | **Game ID:** ${gameDetails.gameID}
:left_right_arrow: **Spread - ** **Opening:** (${awayOpenSpread} | ${homeOpenSpread}) | **Current:** (${awayCurrentSpread} | ${homeCurrentSpread}) | Presented by: ${broadcastEmojis.FanDuel}
:money_with_wings: **Odds - ** **Opening:** (${awayOpeningMoneyLine} | ${homeOpeningMoneyLine}) | **Current:** (${awayCurrentMoneyLine} | ${homeCurrentMoneyLine})
`, 
                    }
                )
            } else if (gameStatus === 2) {
                betsEmbed.addFields(
                    {
                        name: `${teamEmojis[teamResults.awayTeam]} ${teamFullNames[teamResults.awayTeam]} (${gameDetails.awayRecord}) @ ${teamEmojis[teamResults.homeTeam]} ${teamFullNames[teamResults.homeTeam]} (${gameDetails.homeRecord}) | ${gameDetails.broadcastEmoji} | Live :red_circle: | ${gameDetails.gameDate}`,
                        value: `:game_die: **Bets:** Locked :lock: | **Arena:** ${gameDetails.arenaName} | **Game ID:** ${gameDetails.gameID}
:left_right_arrow: **Spread - ** **Opening:** (${awayOpenSpread} | ${homeOpenSpread}) | **Current:** (${awayCurrentSpread} | ${homeCurrentSpread}) | Presented by: ${broadcastEmojis.FanDuel}
:money_with_wings: **Odds - ** **Opening:** (${awayOpeningMoneyLine} | ${homeOpeningMoneyLine}) | **Current:** (${awayCurrentMoneyLine} | ${homeCurrentMoneyLine})
`, 
                    }
                )
            } else {
                betsEmbed.addFields(
                    {
                        name: `${teamEmojis[teamResults.awayTeam]} ${teamFullNames[teamResults.awayTeam]} (${gameDetails.awayRecord}) @ ${teamEmojis[teamResults.homeTeam]} ${teamFullNames[teamResults.homeTeam]} (${gameDetails.homeRecord}) | ${gameDetails.broadcastEmoji} | Final :checkered_flag: | ${gameDetails.gameDate}`,
                        value: `:game_die: **Bets:** Locked :lock: | **Arena:** ${gameDetails.arenaName} | **Game ID:** ${gameDetails.gameID}
:left_right_arrow: **Spread - ** **Opening:** (${awayOpenSpread} | ${homeOpenSpread}) | **Current:** (${awayCurrentSpread} | ${homeCurrentSpread}) | Presented by: ${broadcastEmojis.FanDuel}
:money_with_wings: **Odds - ** **Opening:** (${awayOpeningMoneyLine} | ${homeOpeningMoneyLine}) | **Current:** (${awayCurrentMoneyLine} | ${homeCurrentMoneyLine})
`, 
                    }
                )
            }
        }

        // show list of games to user
        interaction.editReply({ embeds: [betsEmbed] })
    },
}