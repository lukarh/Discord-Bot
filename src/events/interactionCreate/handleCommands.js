const { devs, testServer } = require ('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands')

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands()
    try {
        const commandObject = localCommands.find((cmd) => 
            cmd.name === interaction.commandName
        )

        if (!commandObject) return


        // check if command is only dev only 
        if (commandObject.devOnly) { 
            // 
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only Developers are allowed to run this command.',
                    ephemeral: true, // only the person running the command can see this message
                })
                return
            }
        }

        if (commandObject.testOnly) { 
            // 
            if (!interaction.guild.id === testServer) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    ephemeral: true, // only the person running the command can see this message
                })
                return
            }
        }

        if (commandObject.permissionsRequired?.length) {
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

        if (commandObject.botPermissions?.length) {
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

        await commandObject.callback(client, interaction)

    } catch (error) {
        console.log(`There was an error running this command: ${error}`)
    }
};