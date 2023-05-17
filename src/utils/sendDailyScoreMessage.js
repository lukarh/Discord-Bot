const cron = require('node-cron')
const { EmbedBuilder } = require('discord.js')
const updateGamesMessage = require('./updateGamesMessage')
const teamEmojis = require(`../assets/teams/emojis.json`)

async function sendDailyScoreMessage (client) {
    const scheduleTime = '33 2 * * *'

    cron.schedule(scheduleTime, () => {

        console.log('triggered daily function')
        const channel = client.channels.cache.get(process.env.NBA_GAME_CHANNEL_ID)

        const currentDateStamp = new Date()
        const options = { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const todayDate = currentDateStamp.toLocaleString('en-US', options);    
        
        const scoresEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Today's NBA Games - ${todayDate}`)
            .setDescription('\n=====================================================================')
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' });

        channel.send({ embeds: [scoresEmbed] })
    })
}

module.exports = sendDailyScoreMessage;