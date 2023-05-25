// imports
const User = require('../../models/User');
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'balance',
    description: "See yours/someone else's balance",
    options: [
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

        // checks if command is being ran in a server
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            })
            return
        }

        // either get requested user's ID, or just gets user ID of person who ran command
        const targetUserId = interaction.options.get('user')?.value || interaction.member.id

        // defer initial reply of interaction - allows the bot to have time to generate a response based on inputs
        await interaction.deferReply()

        // checks to find if user exists in database
        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id })

        // checks if user bet profile exists - if not, tell them the user doesn't have a bet profile/balance
        if (!user) {
            interaction.editReply(`<@${targetUserId} doesn't have a profile yet.`)
            return
        }

        // fetch user details and their balance, send reply message with user's balance.
        const targetUser = await client.users.fetch(targetUserId);
        const targetUsername = targetUser.username

        interaction.editReply(
            targetUserId === interaction.member.id 
                ? `Your current balance is **$${user.balance.toFixed(2)}**`
                : `${targetUsername}'s current balance is **$${user.balance.toFixed(2)}**`
        )

    },
}