const Bets = require('../../models/Bets');
const User = require('../../models/User');
const teamFullNames = require(`../../assets/teams/full-names.json`);
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')
const { getGameDetails, getScoreboard } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'claim-bet',
    description: "Claim your bet ",
    options: [
        {
            name: 'game-id',
            description: 'See nba-live-games text channel for the Game ID or type /available-game-bets.',
            type: ApplicationCommandOptionType.Number, 
            required: true,
        }
    ],
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        const gameID = interaction.options.get('game-id').value

        // defer initial reply of interaction - allows the bot to have time to generate a response based on inputs
        await interaction.deferReply()

        // search Bets database if the user has placed a bet for that game
        const betQuery = {
            userId: interaction.member.id,
            guildId: interaction.guild.id,
            gameId: gameID,
        }

        let bet = await Bets.findOne(betQuery)

        const liveGameObjects = await getScoreboard(rawJSON=false)
        const liveGameInfo = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
        const gameDetails = await getGameDetails(gameID)
        const gameStatus = (liveGameObjects.length !== 0) ? liveGameInfo.gameStatus : gameDetails.gameStatus

        if (bet) {
            // find user in users database and update their balance
            const userQuery = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            }
            let user = await User.findOne(userQuery)

            // check if game has not started
            if (gameStatus === 1) {
                interaction.editReply(`You **cannot claim** your bet for the following **Game ID: ${gameID}** because the game has not ended.`)
                return
            // check if game is currently live
            } else if (gameStatus === 2) {
                interaction.editReply(`You **cannot claim** your bet for the following **Game ID: ${gameID}** because the game is currently in progress. Please wait until the game has ended.`)
                return
            // check if game has ended
            } else if (gameStatus === 3) {
                // fetch and check who won the game
                const awayScore = liveGameInfo.awayTeam.score
                const homeScore = liveGameInfo.homeTeam.score
                const winningTeam = (awayScore > homeScore) ? liveGameInfo.awayTeam.teamTricode : liveGameInfo.homeTeam.teamTricode
                const oppositeTeam = (liveGameInfo.homeTeam !== bet.betTeam) ? liveGameInfo.homeTeam : liveGameInfo.awayTeam

                // check if the user bet on the winning team
                if (winningTeam === bet.betTeam) {
                    user.balance += bet.possiblePayout
                    user.wins += 1
                    user.careerBuyIn += bet.betAmount
                    user.careerPayout += bet.possiblePayout

                    await user.save()

                    interaction.editReply(`Congratulations! Your bet for the **${teamFullNames[betTeam]}** to win against the **${teamFullNames[oppositeTeam]}** has given you a payout of **$${bet.possiblePayout.toFixed(2)}**.
Your current balance is: **$${user.balance.toFixed(2)}**`)

                // else, the user lost their bet
                } else {
                    user.loss += 1
                    user.careerBuyIn += bet.betAmount

                    await user.save()

                    interaction.editReply(`Unlucky, try again next time! Your bet for the **${teamFullNames[betTeam]}** to win against the **${teamFullNames[oppositeTeam]}** lost you **$${bet.betAmount.toFixed(2)}**.
Your current balance is: **$${user.balance.toFixed(2)}**`)

                }
            }
        // bet does not exist
        } else {
            interaction.editReply(`You **do not have a bet** to be claimed for the following **Game ID: ${gameID}**. If you believe this is incorrect, please contact an Admin.`)
            return
        }

        // delete the bet from the database
        await Bets.deleteMany(betQuery)

        return
    },
}