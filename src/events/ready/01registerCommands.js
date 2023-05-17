const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent')
const getLocalCommands = require('../../utils/getLocalCommands');
const getApplicationCommands = require('../../utils/getApplicationCommands');

const updateGamesMessage = require('../../utils/updateGamesMessage')

module.exports = async (client) => {

    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer)

        // compare local and application commands
        for (const localCommand of localCommands) {
            // fetch name description, options of local command
            const { name, description, options } = localCommand

            // search for existing command with same name in the server
            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            )

            // if an existing command exists with that name
            if (existingCommand) {
                // delete and overwrite the existing command
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id)
                    console.log(`Deleted command "${name}".`)
                    continue
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options
                    })

                    console.log(`Edited command "${name}".`)
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`Skipping registering command "${name} as it's set to delete.`)
                    continue
                }
                // if command does not exist and not set to be deleted
                await applicationCommands.create({
                    name, 
                    description,
                    options,
                }) 

                console.log(`Registered command "${name}".`)
            }
        }

        console.log('Finished registering commands.')

    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}