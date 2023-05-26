// imports
const Bets = require('../../models/Bets');
const User = require('../../models/User');
const teamFullNames = require(`../../assets/teams/full-names.json`);
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const { getScoreboard, getTodaysOdds, getGameOdds, getGameDetails, getHomeAndAwayTeam } = require('../../utils/getLiveNBAData');

module.exports = {
    name: 'bet-east',
    description: "Place a bet on an Eastern Conference Team for a NBA game.",
    options: [
        {
            name: 'team',
            description: 'Select a Eastern Conference Team from the given options.',
            type: String,
            type: ApplicationCommandOptionType.String, 
            required: true,
            choices: [
                { name: 'Atlanta Hawks', value: 'ATL'},
                { name: 'Boston Celtics', value: 'BOS'},
                { name: 'Brooklyn Nets', value: 'BKN'},
                { name: 'Charlotte Hornets', value: 'CHA'},
                { name: 'Chicago Bulls', value: 'CHI'},
                { name: 'Cleveland Cavaliers', value: 'CLE'},
                { name: 'Detroit Pistons', value: 'DET'},
                { name: 'Indiana Pacers', value: 'IND'},
                { name: 'Miami Heat', value: 'MIA'},
                { name: 'Milwaukee Bucks', value: 'MIL'},
                { name: 'New York Knicks', value: 'NYK'},
                { name: 'Orlando Magic', value: 'ORL'},
                { name: 'Philadelphia 76ers', value: 'PHI'},
                { name: 'Toronto Raptors', value: 'TOR'},
                { name: 'Washington Wizards', value: 'WAS'}
            ],
        },
        {
            name: 'amount',
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
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            })
             
            return
        }

        // fetch user ID and user inputs from command input
        const targetUserId = interaction.member.id
        const team = interaction.options.get('team').value
        const betAmount = interaction.options.get('amount').value
        const gameID = interaction.options.get('game-id').value

        // defer initial reply of interaction - allows the bot to have time to generate a response based on inputs
        await interaction.deferReply()

        // Validate if the amount is a number and has two or fewer decimal places
        if (!/^\d+(\.\d{1,2})?$/.test(betAmount)) {
            interaction.editReply({
                content: `Please enter a valid money bet with two or fewer decimal places. You inputted the following: **$${betAmount}**`,
                ephemeral: true
            })
            return
        }

        // checks if the new amount is not less than 0
        if (betAmount < 1.00) {
            interaction.editReply(`Invalid bet. You **must** place a bet that is **greater** than **$1.00**.`)
            return
        }

        // checks to find if user exists in database
        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id })
        if (!user) {
            interaction.editReply(`You don't have a virtual bet profile set up yet. Please type in **/signup** to create a profile.`)
            return
        }

        // checks if user has enough to place the bet
        if(betAmount > user.balance) {
            interaction.editReply(`You do not have the sufficient amount of funds to place that bet. [**Current Balance:** $${user.balance} | **Bet Attempted:** $${betAmount}]`)
            return
        }

        // fetch odds for today's games and check if bets are available today
        const oddsObjects = await getTodaysOdds(rawJSON=false)
        if (oddsObjects === undefined) {
            interaction.editReply(`There are no games to bet on today. Please try again when there are games available to bet on.`)
            return
        }

        // fetch game odds for the user's specific game and check if it's a valid game to bet on
        const gameOddsInfo = oddsObjects.find(gameOddsInfo => parseInt(gameOddsInfo.gameId) === gameID)
        if (gameOddsInfo === undefined) {
            interaction.editReply(`Invalid Game ID! Please check the **#nba-live-games** channel and copy & paste the Game ID of the game you want to bet on or type **/available-game-bets**.
Please also note that you can only bet on **today's games or tomorrow's games** if the game odds are available or the game has not started/ended.`)
            return
        }

        // fetch league schedule and current live games to check for current game status
        const liveGameObjects = await getScoreboard(rawJSON=false)
        const liveGameInfo = liveGameObjects.find(liveGameInfo => parseInt(liveGameInfo.gameId) === gameID)
        const gameDetails = await getGameDetails(gameID)
        const gameStatus = (liveGameObjects.length !== 0) ? liveGameInfo.gameStatus : gameDetails.gameStatus

        // check if the game is live or has ended
        if (gameStatus == 2) {
            interaction.editReply(`This game is currently **in progress**. Bets are **permenantly closed** for this game.`)
            return
        } else if (gameStatus == 3) {
            interaction.editReply(`This game has already **ended**. You **cannot** place a bet for a game that ended.`)
            return
        }

        // search Bets database if the user has already placed a bet for that game
        const query = {
            userId: interaction.member.id,
            guildId: interaction.guild.id,
            gameId: gameID,
        }
        let bet = await Bets.findOne(query)

        // checks if a bet exists for that user in the database
        if (bet) {
            interaction.editReply(`You already have a bet placed for this game. If you want revise or cancel your bet, please type **/edit-bet** or **/cancel-bet**.`)
            return
        }

        // fetch game odds and details
        const gameOdds = await getGameOdds(gameOddsInfo)
        const teamResults = await getHomeAndAwayTeam(gameID)
        const odds = (team === teamResults.homeTeam) ? gameOdds.outcomes[0].odds : ((team === teamResults.awayTeam) ? gameOdds.outcomes[1].odds: undefined)
        const opponentTeam = (team === teamResults.homeTeam) ? teamResults.awayTeam : teamResults.homeTeam

        // check if the team that user is betting on does not exist in the game
        if ((team !== teamResults.homeTeam) && (team !== teamResults.awayTeam)) {
            interaction.editReply(`The team you bet on, the **${teamFullNames[team]}**, is not involved in the Game [**${gameID}**] you are requesting to bet for.
The two teams involved in this game are: [**Home Team**: ${teamFullNames[teamResults.homeTeam]} | **Away Team:** ${teamFullNames[teamResults.awayTeam]}]`)
            return
        }

        // check if odds were able to be found
        if (odds !== undefined) {
            // calculate possible payout
            const possiblePayout = (betAmount * odds).toFixed(2)

            // update the user's balance
            user.balance -= betAmount
            await user.save();

            // create and save bet details to the bets database
            const newBet = new Bets({
                userId: interaction.member.id,
                guildId: interaction.guild.id,
                betAmount: betAmount,
                gameId: gameID,
                possiblePayout: possiblePayout,
                betTeam: team,
            })
            await newBet.save()

            interaction.editReply(`Your **$${betAmount.toFixed(2)}** bet for the **${teamFullNames[team]}** to *win* against the **${teamFullNames[opponentTeam]}** has been successfully processed! Your **current balance** is now: **$${user.balance.toFixed(2)}**
- If the **${teamFullNames[team]} wins**, your **total possible payout** is: **$${possiblePayout}**, which will net you a profit of **$${(possiblePayout - betAmount).toFixed(2)}**. 
- If you want to **edit or cancel** your bet, please type **/edit-bet [game-id]** or **/cancel-bet [game-id]**. The **Game ID: ${gameID}**.`)
            return
        // else, there was an error getting the odds for the bet placed
        } else {
            interaction.editReply(`An error occurred getting odds for the team you tried to place a bet on. Please contact an Admin to investigate this issue.`)``
            return
        }
    },
}