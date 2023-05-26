// imports
const Bets = require('../../models/Bets');
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')
const { getGameDetails, getScoreboard } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'cancel-bet',
    description: "Cancel a current bet you have in place.",
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

        // if bet for the game exists, delete bet
        if (bet) {
            // fetch league schedule and current live games to check for current game status
            const liveGameObjects = await getScoreboard(rawJSON=false)
            const liveGameInfo = liveGameObjects.find(liveGameInfo => parseInt(liveGameInfo.gameId) === gameID)
            const gameDetails = await getGameDetails(gameID)
            const gameStatus = ((liveGameObjects.length !== 0) && (liveGameInfo !== undefined)) ? liveGameInfo.gameStatus : gameDetails.gameStatus

            if (gameStatus === 2) {
                interaction.editReply(`This game is currently **in progress**. You **cannot** edit a bet for a game that is live.`)
                return
            } else if (gameStatus === 3) {
                interaction.editReply(`This game has already **ended**. You **cannot** cancel a bet for a game that ended.`)
                return
            } else {
                // fetch the amount to giveback to the user
                const returnAmount = bet.betAmount

                // delete the bet from the database
                await Bets.deleteMany(betQuery)

                // find user in users database and update their balance
                const userQuery = {
                    userId: interaction.member.id,
                    guildId: interaction.guild.id,
                }
                let user = await User.findOne(userQuery)

                // update user's details
                user.balance += returnAmount
                await user.save()

                interaction.editReply(
                    `Your **$${returnAmount.toFixed(2)}** bet for **Game ID: ${gameID}** has been successfully canceled! Your **updated balance** is: **$${user.balance.toFixed(2)}**.`
                )

                return
            }
        // else, inform the user that he does not have a current bet
        } else {
            interaction.editReply(
                `You **do not have a bet** currently placed for the following **Game ID: ${gameID}**. If you believe this is incorrect, please contact an Admin.`
                )
            return
        }
    },
}