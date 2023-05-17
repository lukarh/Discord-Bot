require('dotenv').config()

module.exports = (client) => {
    const channelId = '1108125143882018936'
    const channel = client.channels.cache.get(channelId)
    if (channel) {
    channel.send('Here are the NBA Games:') 
    } else {
        console.log('Invalid Channel ID')
    }
};