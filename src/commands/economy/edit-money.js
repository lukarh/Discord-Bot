const Bets = require('../../models/Bets');
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'edit-money',
    description: "[Admin-Only] Edit the balance of a user.",
    options: [
        {
            name: 'balance',
            description: 'e.g. 10, 9.50, 0.23, 21.30, etc..',
            type: ApplicationCommandOptionType.Number, 
            required: true,
        },
        {
            name: 'buy-in',
            description: 'e.g. 10, 9.50, 0.23, 21.30, etc..',
            type: ApplicationCommandOptionType.Number, 
            required: true,
        },
        {
            name: 'payout',
            description: 'e.g. 10, 9.50, 0.23, 21.30, etc..',
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

        // check if you're admin
        if (interaction.user.id !== adminID) {
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
        const newBalance = interaction.options.get('balance').value
        const newBuyIn = interaction.options.get('buy-in').value
        const newPayout = interaction.options.get('payout').value

        // make edits in the database
        user.balance = newBalance.toFixed(2)
        user.careerBuyIn = newBuyIn.toFixed(2)
        user.careerPayout = newPayout.toFixed(2)

        await user.save()

        // send reply message indicating the change
        interaction.editReply(
            targetUserId === interaction.member.id 
                ? `Your balance is now: **$${newBalance.toFixed(2)}**; Career Buy-in: **$${newBuyIn.toFixed(2)}**; Career Payout: **$${newPayout.toFixed(2)}**`
                : `@${targetUsername}'s balance is now: **$${newBalance.toFixed(2)}**; Career Buy-in: **$${newBuyIn.toFixed(2)}**; Career Payout: **$${newPayout.toFixed(2)}**`
        );

        return
    },

}