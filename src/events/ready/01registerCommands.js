// imports
const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent')
const getLocalCommands = require('../../utils/getLocalCommands');
const getApplicationCommands = require('../../utils/getApplicationCommands');

module.exports = async (client) => {
    try {
        // fetch local and application commands
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

            // checks if a command exists with that name
            if (existingCommand) {
                // delete and overwrite the existing command
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id)
                    console.log(`Deleted command "${name}".`)
                    continue
                }

                // checks if the two commands are different, if so- overwrite it
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options
                    })
                    console.log(`Edited command "${name}".`)
                }

            } else {
                // checks if command is set to be deleted, if so, do not create the new command
                if (localCommand.deleted) {
                    console.log(`Skipping registering command "${name} as it's set to delete.`)
                    continue
                }
                // checks if command does not exist and if not, create new command
                await applicationCommands.create({
                    name, 
                    description,
                    options,
                }) 

                console.log(`Registered command "${name}".`)
            }
        }

        console.log('1) Finished registering commands!')

    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
}