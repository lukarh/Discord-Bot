const path = require('path')
const getAllFiles = require('../utils/getAllFiles')

module.exports = (client) => {
    // fetch all event folder paths
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true) // go up one level and targets the events folder

    // loop through all of the folders in the events folder
    for (const eventFolder of eventFolders) {
        // fetch all event files within that folder
        const eventFiles = getAllFiles(eventFolder)
        eventFiles.sort((a,b) => a > b)
        
        // replace back slashes with forward slashes and extract event name from it
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()
        
        // add an event listener for client (e.g. interactionCreate, ready, ...)
        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                // extract all the functions from the files
                const eventFunction = require(eventFile)
                // run the functions inside the files
                await eventFunction(client, arg)
            }
        })
    }
}