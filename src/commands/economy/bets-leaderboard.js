// imports
const User = require('../../models/User');
const teamEmojis = require(`../../assets/teams/emojis.json`)
const { getCurrentDateTime } = require('../../utils/getCurrentDateTime')
const { Client, Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'bets-leaderboard',
    description: "See the bets leaderboard and see who has won the most bets and money!",
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {
        // write command logic here...
        await interaction.deferReply()

        const timeResults = await getCurrentDateTime()

        const leaderboardEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} NBA Bets Leaderboard  :newspaper: | Fetched @ ${timeResults.todaysDate} - ${timeResults.currentTime} :arrows_counterclockwise:`)
            .setDescription(`=====================================================================`)
            .setColor(`#8a2be2`)
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' })

        // Fetch all bet documents from the MongoDB collection
        let users = await User.find();

        // sort users by win-loss percentage
        users = users.sort((a, b) => {
            let winLossPercentageA = a.wins / (a.wins + a.loss)
            let winLossPercentageB = b.wins / (b.wins + b.loss)

            winLossPercentageA = (!isNaN(winLossPercentageA)) ? winLossPercentageA : 0.0
            winLossPercentageB = (!isNaN(winLossPercentageB)) ? winLossPercentageB : 0.0

            return winLossPercentageB - winLossPercentageA
        });

        if (users.length !== 0) {
            let seed = 1

            for (const user of users) {
                // get target user details
                const targetUser = await client.users.fetch(user.userId)
                const username = targetUser.username
                const winLossPercentage = (user.wins / (user.wins + user.loss) * 100).toFixed(1)

                // const winLossPercentage = await ((user.wins + user.loss) !== 0) ? (user.wins / (user.wins + user.loss) * 100).toFixed(1) : -

                leaderboardEmbed.addFields({
                    name: `#${seed}) :identification_card: User: ${username} | :trophy: W-L: (${user.wins}-${user.loss}) | :bar_chart: Win Rate: ${(!isNaN(winLossPercentage) ? winLossPercentage : '-')}% `,
                    value: `:credit_card: **Balance:** $${user.balance.toFixed(2)} | :moneybag: **Career Buy-in:** $${user.careerBuyIn.toFixed(2)} | :money_with_wings: **Career Payout:** $${user.careerPayout.toFixed(2)}`,
                })
                seed += 1
            }
        } else {
            leaderboardEmbed.addFields(
                {
                    name: `:no_entry_sign: There are no user bet profiles at the moment. :no_entry_sign:`,
                    value: `=====================================================================`, 
                }
            )
        }

        // show bets leaderboard to user
        interaction.editReply({ embeds: [leaderboardEmbed] })
        return
    },
}