const Bets = require('../../models/Bets');
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'create-custom-bet',
    description: "[Admin-Only] Create a custom test bet to process.",
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
            name: 'possible-payout',
            description: 'e.g. 10, 9.50, 0.23, 21.30, etc..',
            type: ApplicationCommandOptionType.Number, 
            required: true,
        },
        {
            name: 'game-id',
            description: 'See nba-live-games text channel for the Game ID or type /available-game-bets.',
            type: ApplicationCommandOptionType.Number, 
            required: true,
        },
        {
            name: 'user',
            description: 'The user whose balance you want to get.',
            type: ApplicationCommandOptionType.User,
        }
    ],
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

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id

        const betAmount = interaction.options.get('amount').value
        const gameID = interaction.options.get('game-id').value
        const team = interaction.options.get('team').value
        const possiblePayout = interaction.options.get('possible-payout').value

        const newBet = new Bets({
            userId: targetUserId,
            guildId: interaction.guild.id,
            betAmount: betAmount,
            gameId: gameID,
            possiblePayout: possiblePayout,
            betTeam: team,
        })
        await newBet.save()

        await interaction.reply(`You've successfully created a new bet to test`);
        return
    },
}