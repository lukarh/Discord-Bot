module.exports = async (client, guildId) => {
    // define applicationCommands
    let applicationCommands;

    // checks for valid serverID and fetches all the commands associated with that server
    if (guildId) {
        const guild = await client.guilds.fetch(guildId) 
        applicationCommands = guild.commands
    } else {
        applicationCommands = await client.application.applicationCommands
    }

    await applicationCommands.fetch()
    return applicationCommands
}