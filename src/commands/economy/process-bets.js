const Bets = require('../../models/Bets');
const User = require('../../models/User');
const teamEmojis = require(`../../assets/teams/emojis.json`)
const { Client, Interaction, EmbedBuilder } = require('discord.js')
const { getCurrentDateTime } = require('../../utils/getCurrentDateTime')
const { getGameDetails, getScoreboard } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'process-bets',
    description: "Attempt to process all the bets currently in placed.",
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        // write command logic here...
        const adminID = '209890349978615808'; // Replace with your Discord user ID

        // check if you're admin
        if (interaction.user.id !== adminID) {
            await interaction.reply('This command is for developers only.');
            return;
        }

        await interaction.deferReply()

        const timeResults = await getCurrentDateTime()

        const processEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Processed Bets Report :newspaper: | Fetched @ ${timeResults.todaysDate} - ${timeResults.currentTime} :arrows_counterclockwise:`)
            .setDescription(`=====================================================================`)
            .setColor(`#ffd700`)
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' })

        // Fetch all bet documents from the MongoDB collection
        const bets = await Bets.find();

        // check if there are bets currently placed
        if (bets.length !== 0) {
            let numBet = 1

            for (const bet of bets) {
                const gameID = bet.gameId

                const liveGameObjects = await getScoreboard(rawJSON=false)
                const liveGameInfo = liveGameObjects.find(liveGameInfo => parseInt(liveGameInfo.gameId) === gameID)
                const gameDetails = await getGameDetails(gameID)
                const gameStatus = ((liveGameObjects.length !== 0) && (liveGameInfo !== undefined)) ? liveGameInfo.gameStatus : gameDetails.gameStatus

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
                    // fetch and check who won the game
                    const awayScore = liveGameInfo.awayTeam.score
                    const homeScore = liveGameInfo.homeTeam.score
                    const winningTeam = (awayScore > homeScore) ? liveGameInfo.awayTeam.teamTricode : liveGameInfo.homeTeam.teamTricode
                    const oppositeTeam = (liveGameInfo.homeTeam.teamTricode !== bet.betTeam) ? liveGameInfo.homeTeam.teamTricode : liveGameInfo.awayTeam.teamTricode

                    // check if the user won the bet
                    if (winningTeam === bet.betTeam) {
                        const prevBalance = user.balance

                        user.wins += 1
                        user.balance += bet.possiblePayout
                        user.careerBuyIn += bet.betAmount
                        user.careerPayout += bet.possiblePayout
    
                        await user.save()

                        processEmbed.addFields({
                            name: `Current Bet #${numBet} | Details: ${teamEmojis[bet.betTeam]} ${bet.betTeam} to win vs. ${teamEmojis[oppositeTeam]} ${oppositeTeam} | Game Date: ${gameDetails.gameDate}`,
                            value: `**User:** ${targetUsername} | :moneybag: **Bet:** $${bet.betAmount.toFixed(2)} | :money_with_wings: **Payout:** $${bet.possiblePayout.toFixed(2)} | :credit_card: **Balance:** $${prevBalance.toFixed(2)} -> $${user.balance.toFixed(2)}
**Processed:** :white_check_mark: - Congrats! :tada: You won your bet!`,
                        })
                    // else, the user lost their bet
                    } else {
                        user.loss += 1
                        user.careerBuyIn += bet.betAmount

                        await user.save()

                        processEmbed.addFields({
                            name: `Current Bet #${numBet} | Details: ${teamEmojis[bet.betTeam]} ${bet.betTeam} to win vs. ${teamEmojis[oppositeTeam]} ${oppositeTeam} | Game Date: ${gameDetails.gameDate}`,
                            value: `**User:** ${targetUsername} | :moneybag: **Bet:** $${bet.betAmount.toFixed(2)} | :money_with_wings: **Payout:** $0.00 | :credit_card: **Balance:** $${user.balance.toFixed(2)}
**Processed:** :white_check_mark: - Unlucky :cry:, try again next time!`
                        })
                    }

                    // Delete the processed bet
                    await Bets.deleteOne({ _id: bet._id })

                } 
                // else, the bet cannot be processed and let the user know that
                else {
                    const oppositeTeam = (gameDetails.homeTeamTricode !== bet.betTeam) ? gameDetails.homeTeamTricode : gameDetails.awayTeamTricode

                    processEmbed.addFields({
                        name: `Current Bet #${numBet} | Details: ${teamEmojis[bet.betTeam]} ${bet.betTeam} to win vs. ${teamEmojis[oppositeTeam]} ${oppositeTeam} | Game Date: ${gameDetails.gameDate}`,
                        value: `**User:** ${targetUsername} | :moneybag: **Bet:** $${bet.betAmount.toFixed(2)} | :money_with_wings: **Payout:** $${bet.possiblePayout.toFixed(2)} | :credit_card: **Balance:** $${user.balance.toFixed(2)}
**Processed:** :x: - **Cannot process bet since the game has not ended yet.**`,
                    })
                }

                numBet += 1
            }
        } 
        // else, there are no bets currently
        else {
            processEmbed.addFields(
                {
                    name: `:no_entry_sign: There are no user bets currently to be processed. :no_entry_sign:`,
                    value: `=====================================================================`, 
                }
            )
        }

        interaction.editReply({ embeds: [processEmbed] })
        return
    },
}