const cron = require('node-cron')
const { EmbedBuilder } = require('discord.js')
const teamEmojis = require(`../assets/teams/emojis.json`)

async function sendDailyScoreMessage (client) {
    const scheduleTime = '30 3 * * *'

    console.log('----------------------------------------')
    console.log('Setting up Scheduled Function...')

    cron.schedule(scheduleTime, () => {

        console.log('Triggered Daily Function.')
        const channel = client.channels.cache.get(process.env.NBA_GAME_CHANNEL_ID)

        const currentDateStamp = new Date()
        const options = { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const todayDate = currentDateStamp.toLocaleString('en-US', options);    
        
        const scoresEmbed = new EmbedBuilder()
            .setTitle(`${teamEmojis.NBA} Live NBA Game Channel - ${todayDate}`)
            .setDescription(`=====================================================================
                             Fetching Data...
                             =====================================================================`)
            .setFooter({ text: 'A (WIP) NBA Discord Bot developed by Lukar.', iconURL: 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-icon-official-arma-koth-host-11.png' });

        channel.send({ embeds: [scoresEmbed] })
    })

    console.log('Finished setting up Scheduled Function!!')
    console.log('----------------------------------------')
}

module.exports = sendDailyScoreMessage;