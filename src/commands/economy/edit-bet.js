// imports
const Bets = require('../../models/Bets');
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')
const { getGameDetails, getScoreboard, getTodaysOdds, getGameOdds, getHomeAndAwayTeam } = require('../../utils/getLiveNBAData');
const teamFullNames = require(`../../assets/teams/full-names.json`);

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
        const newBetAmount = interaction.options.get('new-amount').value

        // defer initial reply of interaction - allows the bot to have time to generate a response based on inputs
        await interaction.deferReply()

        // Validate if the amount is a number and has two or fewer decimal places
        if (!/^\d+(\.\d{1,2})?$/.test(newBetAmount)) {
            interaction.editReply({ content: `Please enter a valid money bet with two or fewer decimal places. You inputted the following: **$${newBetAmount}**`})
            return
        }

        // checks if the new amount is not less than 0
        if ((newBetAmount < 1.00)) {
            interaction.editReply(`Edited bet total **must be greater** than **$1.00**.`)
            return
        }

        // search Bets database if the user has placed a bet for that game
        const betQuery = {
            userId: interaction.member.id,
            guildId: interaction.guild.id,
            gameId: gameID,
        }
        let bet = await Bets.findOne(betQuery)

        const team = bet.betTeam

        // if bet for the game exists, delete bet
        if (bet) {
            // fetch league schedule and current live games to check for current game status
            const liveGameObjects = await getScoreboard(rawJSON=false)
            const liveGameInfo = liveGameObjects.find(liveGameInfo => parseInt(liveGameInfo.gameId) === gameID)
            const gameDetails = await getGameDetails(gameID)
            const gameStatus = ((liveGameObjects.length !== 0) && (liveGameInfo !== undefined)) ? liveGameInfo.gameStatus : gameDetails.gameStatus

            // check if game is in progress
            if (gameStatus === 2) {
                interaction.editReply(`This game is currently **in progress**. You **cannot** edit a bet for a game that is live.`)
                return
            // check if game has already finished
            } else if (gameStatus === 3) {
                interaction.editReply(`This game has already **ended**. You **cannot** edit a bet for a game that ended.`)
                return
            // else, attempt to edit the user's bet
            } else {
                try {
                    // fetch game odds and details
                    const oddsObjects = await getTodaysOdds(rawJSON=false)
                    const gameOddsInfo = oddsObjects.find(gameOddsInfo => parseInt(gameOddsInfo.gameId) === gameID)
                    const gameOdds = await getGameOdds(gameOddsInfo)
                    const teamResults = await getHomeAndAwayTeam(gameID)
                    const odds = (team === teamResults.homeTeam) ? gameOdds.outcomes[0].odds : ((team === teamResults.awayTeam) ? gameOdds.outcomes[1].odds: undefined)

                    // calculate possible payout
                    const newPossiblePayout = (newBetAmount * odds).toFixed(2)
                    const prevPossiblePayout = bet.possiblePayout
                    const prevBetAmount = bet.betAmount

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

                    // update user's balance
                    user.balance -= balanceChange
                    await user.save()

                    // update user's bet details
                    bet.betAmount = newBetAmount
                    bet.possiblePayout = newPossiblePayout
                    await bet.save()

                    interaction.editReply(`Your bet for **Game ID: ${gameID}** has been successfully changed from **$${prevBetAmount.toFixed(2)}** to **$${newBetAmount.toFixed(2)}**! 
If the ${teamFullNames[team]} win, your new possible payout has changed from **$${prevPossiblePayout.toFixed(2)}** to **$${newPossiblePayout.toFixed(2)}**. Your **updated balance** is: **$${user.balance.toFixed(2)}**.`)

                    return
                // else, there was an error getting the odds
                } catch (error) {
                    console.log('There was an error getting the game odds while editing the bet:', error)
                    interaction.editReply(`There was an error getting game odds for the following **Game ID: ${gameID}**. Please contact an Admin to investigate.`)
                    return
                }
            }
        } else {
            interaction.editReply(`You **do not have a bet** currently placed for the following **Game ID: ${gameID}**. If you believe this is incorrect, please contact an Admin.`)
            return
        }

    },
}