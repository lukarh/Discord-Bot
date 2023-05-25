const { Client, Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'bet-help',
    description: "Get a list of all available /commands for the betting system.",
    /** 
    * @param {Client} client 
    * @param {Interaction} interaction
    **/
    callback: async (client, interaction) => {

        await interaction.deferReply()

        // create embed
        const helpEmbed = new EmbedBuilder()        
            .setTitle(`How to use NBA Discord Bot to place bets for NBA Games`)
            .setDescription('Useful Commands')
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' })
            .addFields(
                {
                    name: '/available-game-bets',
                    value: 'Get a list of available game bets.',
                    inline: true,
                },
                {
                    name: '/bet-east',
                    value: 'Bet on a Eastern Conference Team to win a game.',
                    inline: true,
                },
                {
                    name: '/bet-west',
                    value: 'Bet on a Western Conference Team to win a game.',
                    inline: true,
                },
                {
                    name: '/bets-leaderboard',
                    value: 'Get the leaderboard of bets. [N/A yet].',
                    inline: true,
                },
                {
                    name: '/balance',
                    value: 'Check your own balance or balance of another user.',
                    inline: true,
                },
                {
                    name: '/cancel-bet',
                    value: 'Cancel a bet you made for a game.',
                    inline: true,
                },
                {
                    name: '/current-bets',
                    value: 'Look at the current bets being made by all users. [N/A yet].',
                    inline: true,
                },
                {
                    name: '/claim-bet',
                    value: 'Cash out on a bet you made for a game. [N/A yet]',
                    inline: true,
                },
                {
                    name: '/daily',
                    value: 'Collect your free daily money.',
                    inline: true,
                },
                {
                    name: '/edit-bet',
                    value: 'Edit a bet you made for a game.',
                    inline: true,
                },
                {
                    name: '/signup',
                    value: 'Sign-Up to create a virtual betting profile on the server.',
                    inline: true,
                },
              )
              .setColor("1AA7EC")

        interaction.editReply({ embeds: [helpEmbed] })
    },
}