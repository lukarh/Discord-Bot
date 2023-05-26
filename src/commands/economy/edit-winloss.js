const Bets = require('../../models/Bets');
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'edit-winloss',
    description: "[Admin-Only] Edit the win-loss of a user.",
    options: [
        {
            name: 'wins',
            description: 'The number of wins.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'losses',
            description: 'The number of losses.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'user',
            description: 'The user whose balance you want to get.',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        const adminID = '209890349978615808'; // Replace with your Discord user ID
        console.log(interaction.user.id)
        // check if you're admin
        if ((interaction.user.id !== adminID) && (interaction.user.id !== '790407407662661643')){
            await interaction.reply('This command is for developers only.');
            return;
        }

        await interaction.deferReply()

        // get target user details
        const targetUserId = interaction.options.get('user')?.value || interaction.member.id
        const targetUser = await client.users.fetch(targetUserId)
        const targetUsername = targetUser.username

        // checks to find if user exists in database
        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id })

        // fetch values from interaction
        const newWins = interaction.options.get('wins').value
        const newLosses = interaction.options.get('losses').value

        // make edits in the new database
        user.wins = newWins
        user.loss = newLosses

        await user.save()

        interaction.editReply(
            targetUserId === interaction.member.id 
                ? `Your wins and losses is now **(${newWins}**-**${newLosses})**`
                : `@${targetUsername}'s wins and losses is now **(${newWins}**-**${newLosses})**`
        );

        return
    },
}