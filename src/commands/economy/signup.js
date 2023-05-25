// imports
const User = require('../../models/User')
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'signup',
    description: "Sign up to bet on NBA games!",
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        // check if command is ran in a server
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            })

            return
        }

        try {
            await interaction.deferReply()

            // get currentDate
            const currentDate = new Date()
            const todaysDate = currentDate.toDateString()

            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            }
            
            let user = await User.findOne(query) 

            // check if user already exists in database
            if (user) {
                interaction.editReply(`You have already signed up to place bets!`)
                return
            // else, create a new user in the database
            } else {
                newUser = new User({
                    userId: interaction.member.id,
                    guildId: interaction.guild.id,
                    balance: 250,
                    signupDate: todaysDate,
                    dailyDate: todaysDate,
                    wins: 0,
                    loss: 0,
                    careerBuyIn: 0,
                    careerPayout: 0,
                })
                
                // save user to database
                await newUser.save()

                interaction.editReply(`You are now eligible to place bets on NBA games! Your current balance is **$${newUser.balance.toFixed(2)}**. Type /bet-help for more info.`)
                return
            }

        } catch (error) {
            console.log(`Error with signing up. Please try again later. Error: ${error}`)
            return
        }

    },
}