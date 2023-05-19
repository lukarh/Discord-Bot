// imports
const { devs, testServer } = require ('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands')

module.exports = async (client, interaction) => {
    // checks if the interaction is a command
    if (!interaction.isChatInputCommand()) return;

    // fetch local commands AKA bot commands from directory
    const localCommands = getLocalCommands()

    // checks for user permissions and validity of input command 
    try {
        // checks if input command is a valid command in the bot
        const commandObject = localCommands.find((cmd) => 
            cmd.name === interaction.commandName
        )

        // if NOT a command, end check
        if (!commandObject) return


        // checks if command is only DevOnly
        if (commandObject.devOnly) { 
            // checks if member who used the command is a Dev
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only Developers are allowed to run this command.',
                    ephemeral: true, // only the person running the command can see this message
                })
                return
            }
        }

        // checks if command is only TestOnly
        if (commandObject.testOnly) { 
            // checks if member is using the test command in the required test server
            if (!interaction.guild.id === testServer) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    ephemeral: true, // only the person running the command can see this message
                })
                return
            }
        }

        // checks if the command has certain permissions required
        if (commandObject.permissionsRequired?.length) {
            // loop through each required permission and checks if user has access to those permissions
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions to run this command. Contact Admin if you believe you deserve access.',
                        ephemeral: true,
                    })
                    return
                }
            }
        }

        // checks if the command has certain bot permissions required
        if (commandObject.botPermissions?.length) {
            // loop through each required permission and checks if bot has access to those permissions
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me
                if (!bot.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    })
                    return
                }
            }
        }

        // execute command 
        await commandObject.callback(client, interaction)

    } catch (error) {
        console.log(`There was an error running this command: ${error}`)
    }
};