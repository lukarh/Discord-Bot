// imports
const User = require('../../models/User');
const { Client, Interaction } = require('discord.js');

const dailyAmount = 25;

module.exports = {
  name: 'daily',
  description: 'Collect your dailies!',
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

    try {
        // defer initial reply of interaction - allows the bot to have time to generate a response based on inputs
        await interaction.deferReply()

        // search database for the user
        const query = {
            userId: interaction.member.id,
            guildId: interaction.guild.id,
        }
        let user = await User.findOne(query)

        // checks if user bet profile exists to add daily too
        if (user) {
            // fetch when user claimed last daily
            const lastDailyDate = (user.lastDaily !== undefined) ? user.lastDaily.toDateString() : undefined
            const currentDate = new Date().toDateString()

            // checks if user already claimed their daily for today
            if (lastDailyDate === currentDate) {
                interaction.editReply(
                    'You have already collected your dailies today. Come back tomorrow!'
                )
                return
            }
        
            user.lastDaily = new Date()
        // else: create a new user in the database
        } else {
            user = new User({
            ...query,
            lastDaily: new Date(),
            });
        }

        // adds +100 to their balance and save updated user profile info in database
        user.balance += dailyAmount
        await user.save()

        // send a message in channel letting the user know their updated balance
        interaction.editReply(
            `**$${dailyAmount.toFixed(2)}** was added to your balance. Your new balance is **$${user.balance.toFixed(2)}**.`
        )
    } catch (error) {
        console.log(`Error with /daily: ${error}`)
    }
  },
};