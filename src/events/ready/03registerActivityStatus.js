// imports
const { ActivityType } = require('discord.js');

module.exports = async (client) => {
    try {
        client.user.setActivity({
            name: 'for NBA Games!',
            type: ActivityType.Watching
        })
        console.log(`3) Finished registering the bot's activity status!`)
    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}