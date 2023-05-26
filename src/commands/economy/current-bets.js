const Bets = require('../../models/Bets');
const User = require('../../models/User');
const teamEmojis = require(`../../assets/teams/emojis.json`)
const { Client, Interaction, EmbedBuilder } = require('discord.js')
const { getCurrentDateTime } = require('../../utils/getCurrentDateTime')
const { getGameDetails, getScoreboard } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'current-bets',
    description: "Attempt to process all the bets currently in placed.",
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        // write command logic here...

        await interaction.deferReply()

        const timeResults = await getCurrentDateTime()

        const betsEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Current Bets Report  :newspaper: | Fetched @ ${timeResults.todaysDate} - ${timeResults.currentTime} :arrows_counterclockwise:`)
            .setDescription(`=====================================================================`)
            .setColor(`#FF69B4`)
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' })

        // Fetch all bet documents from the MongoDB collection
        const bets = await Bets.find();

        // check if there are bets currently placed
        if (bets.length !== 0) {
            let numBet = 1

            for (const bet of bets) {
                // get gameID of the bet
                const gameID = bet.gameId

                // get game details of the bet
                const liveGameObjects = await getScoreboard(rawJSON=false)
                const liveGameInfo = liveGameObjects.find(liveGameInfo => parseInt(liveGameInfo.gameId) === gameID)
                const gameDetails = await getGameDetails(gameID)
                const gameStatus = ((liveGameObjects.length !== 0) && (liveGameInfo !== undefined)) ? liveGameInfo.gameStatus : gameDetails.gameStatus
                const oppositeTeam = (gameDetails.homeTeamTricode !== bet.betTeam) ? gameDetails.homeTeamTricode : gameDetails.awayTeamTricode

                // find user in database
                const userQuery = {
                    userId: bet.userId,
                    guildId: bet.guildId,
                }
                let user = await User.findOne(userQuery)

                // get target user details
                const targetUser = await client.users.fetch(bet.userId)
                const targetUsername = targetUser.username

                // if the game has finished, allow the bet to be processed
                if (gameStatus === 3) {
                    betsEmbed.addFields({
                        name: `Current Bet #${numBet} | Details: ${teamEmojis[bet.betTeam]} ${bet.betTeam} to win vs. ${teamEmojis[oppositeTeam]} ${oppositeTeam} | Game Date: ${gameDetails.gameDate}`,
                        value: `**User:** ${targetUsername} | :moneybag: **Bet:** $${bet.betAmount.toFixed(2)} | :money_with_wings: **Payout:** $${bet.possiblePayout.toFixed(2)} | :credit_card: **Balance:** $${user.balance.toFixed(2)}
**:closed_lock_with_key: Bet Status:** TBP -  Your bet results will be reflected on your profile soon.`,
                    })
                // if the game is in progress...
                } else if (gameStatus === 2) {
                    betsEmbed.addFields({
                        name: `Current Bet #${numBet} | Details: ${teamEmojis[bet.betTeam]} ${bet.betTeam} to win vs. ${teamEmojis[oppositeTeam]} ${oppositeTeam} | Game Date: ${gameDetails.gameDate}`,
                        value: `**User:** ${targetUsername} | :moneybag: **Bet:** $${bet.betAmount.toFixed(2)} | :money_with_wings: **Payout:** $${bet.possiblePayout.toFixed(2)} | :credit_card: **Balance:** $${user.balance.toFixed(2)}
**:lock: Bet Status:** Closed - This bet cannot be edited or canceled since the game is in progress.`,
                    })
                // if the game has not started
                } else if (gameStatus === 1) {
                    betsEmbed.addFields({
                        name: `Current Bet #${numBet} | Details: ${teamEmojis[bet.betTeam]} ${bet.betTeam} to win vs. ${teamEmojis[oppositeTeam]} ${oppositeTeam} | Game Date: ${gameDetails.gameDate}`,
                        value: `**User:** ${targetUsername} | :moneybag: **Bet:** $${bet.betAmount.toFixed(2)} | :money_with_wings: **Payout:** $${bet.possiblePayout.toFixed(2)} | :credit_card: **Balance:** $${user.balance.toFixed(2)}
**:unlock: Bet Status:** Open - You may make edits to or cancel your bet.`,
                    })
                }

                numBet += 1
            }
        } 
        // else, there are no bets currently
        else {
            betsEmbed.addFields(
                {
                    name: `:no_entry_sign: There are no user bets currently. :no_entry_sign:`,
                    value: `=====================================================================`, 
                }
            )
        }

        interaction.editReply({ embeds: [betsEmbed] })
        return
    },
}