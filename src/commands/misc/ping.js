module.exports = {
    name: 'ping2',
    description: 'Pong!',
    devOnly: true,
    // devOnly: Boolean,
    // testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
}