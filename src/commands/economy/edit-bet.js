// imports
const Bets = require('../../models/Bets');
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')
const { getGameDetails, getScoreboard } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'edit-bet',
    description: "Edit a current bet you have in place.",
    options: [
        {
            name: 'new-amount',
            description: 'e.g. 10, 9.50, 0.23, 21.30, etc..',
            type: ApplicationCommandOptionType.Number, 
            required: true,
        },
        {
            name: 'game-id',
            description: 'See nba-live-games text channel for the Game ID of the game you want to bet on.',
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

        // if bet for the game exists, delete bet
        if (bet) {
            // fetch league schedule and current live games to check for current game status
            const liveGameObjects = await getScoreboard(rawJSON=false)
            const liveGameInfo = liveGameObjects.find(liveGameInfo => liveGameInfo.gameId === gameID)
            const gameStatus = (liveGameInfo !== undefined) ? liveGameInfo.gameStatus : await getGameDetails(gameID).gameStatus

            if (gameStatus === 2) {
                interaction.editReply(`This game is currently **in progress**. You **cannot** edit a bet for a game that is live.`)
                return
            } else if (gameStatus === 3) {
                interaction.editReply(`This game has already **ended**. You **cannot** cancel a bet for a game that ended.`)
                return
            } else {
                // fetch the amount to giveback to the user
                const prevBetAmount = bet.betAmount

                const newBetAmount = interaction.options.get('new-amount').value

                // checks if the new amount is not less than 0
                if ((newBetAmount < 1.00)) {
                    interaction.editReply(`Edited bet total **must be greater** than **$1.00**.`)
                    return
                }

                // find user in users database and update their balance
                const userQuery = {
                    userId: interaction.member.id,
                    guildId: interaction.guild.id,
                }
                let user = await User.findOne(userQuery)

                // checks if user has enough to place the new bet
                if (newBetAmount > (user.balance + prevBetAmount).toFixed(2)) {
                    interaction.editReply(`You **do not have the sufficient** amount of funds to edit your bet. [**Current Balance:** $${user.balance.toFixed(2)} | **Bet Attempted:** $${newBetAmount.toFixed(2)}]`)
                    return
                }

                const balanceChange = (newBetAmount - prevBetAmount).toFixed(2)

                user.balance -= balanceChange
                await user.save()

                bet.betAmount = newBetAmount
                await bet.save()

                interaction.editReply(
                    `Your bet for **Game ID: ${gameID}** has been successfully changed from **$${prevBetAmount.toFixed(2)}** to **$${newBetAmount.toFixed(2)}**! Your **updated balance** is: **$${user.balance.toFixed(2)}**.`
                )

                return
            }

        } else {
            interaction.editReply(
                `You **do not have a bet** currently placed for the following **Game ID: ${gameID}**. If you believe this is incorrect, please contact an Admin.`
                )
            return
        }

    },
}