// imports
const path = require('path')
const getAllFiles = require('./getAllFiles')

module.exports = (exceptions = []) => {
    // define localCommands
    let localCommands = []

    // get all files in the commands folder of the bot directory
    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    )

    // loop through the folders/files in commands folder
    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory)

        // loop through the individual command file in the folder
        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile)

            if (exceptions.includes(commandObject.name)) {
                continue
            }

            // add to list of localCommands
            localCommands.push(commandObject)
        }
    }

    return localCommands

}