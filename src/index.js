// Libraries
require('dotenv').config()
const eventHandler = require('./handlers/eventHandler');
const { Client, IntentsBitField, ActivityType } = require('discord.js') // destructuring: importing a set amount of things from something, in this case a package

const client = new Client({
    intents: [ // intents are a set of permissions the bots can use in order to get access to a set of events
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

let status = [
    {
        name: 'Live NBA Games',
        type: ActivityType.Watching
    },
    {
        name: 'for New NBA Games',
        type: ActivityType.Watching
    },
    {
        name: 'nothing today :(',
        type: ActivityType.Watching
    }
]

eventHandler(client);

client.login(process.env.TOKEN);

// client.on('ready', (c) => {
//     console.log(`${c.user.tag} is online.`)

//     // client.user.setActivity({
//     //     name: 'NBA Games',
//     //     type: ActivityType.Watching
//     // })

//     setInterval(() => {
//         let random = Math.floor(Math.random() * status.length)
//         client.user.setActivity(status[random])
//     }, 10000) // 1000 is 1 second
// })

// // relies on GuildMessages & MessageContent permissions from Intents
// client.on('messageCreate', (msg) => {
//     if (msg.author.bot) {
//         return;
//     }

//     if (msg.content === 'hello') {
//         msg.reply("hello")
//     }
// })

// client.on('interactionCreate', (interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     // if code is a slash command
//     if (interaction.commandName === 'hey') {
//         interaction.reply('hey!')
//     }

//     if (interaction.commandName === 'ping') {
//         interaction.reply('pong!')
//     }

//     if (interaction.commandName === 'add') { 
//         const num1 = interaction.options.get('first-number').value
//         const num2 = interaction.options.get('second-number').value

//         console.log(num1)
//         interaction.reply(`The sum is ${num1 + num2}`)
//     }

//     if (interaction.commandName === 'embed') {
//         const embed = new EmbedBuilder()
//             .setTitle("Embed Title")
//             .setDescription("This is an embed")
//             .setColor('Random') // 0x[hexcode]
//             .addFields(
//                 { 
//                     name: 'Field title', 
//                     value: 'Some random value',
//                     inline: true,
//                 },
//                 { 
//                     name: '2nd Field title', 
//                     value: 'Some random value',
//                     inline: true,
//                 }
//             )
//             .addFields(
//                 { 
//                     name: 'Field title', 
//                     value: 'Some random value',
//                 },
//                 { 
//                     name: '2nd Field title', 
//                     value: 'Some random value',
//                 }
//             )
        
//         interaction.reply({ embeds: [embed] })
//     }
// })

// client.on('messageCreate', (msg) => {
//     if (msg.content === 'embed') {
//         const embed = new EmbedBuilder()
//             .setTitle("Embed Title")
//             .setDescription("This is an embed")
//             .setColor('Random') // 0x[hexcode]
//             .addFields(
//                 { 
//                     name: 'Field title', 
//                     value: 'Some random value',
//                     inline: true,
//                 },
//                 { 
//                     name: '2nd Field title', 
//                     value: 'Some random value',
//                     inline: true,
//                 }
//             )
//             .addFields(
//                 { 
//                     name: 'Field title', 
//                     value: 'Some random value',
//                 },
//                 { 
//                     name: '2nd Field title', 
//                     value: 'Some random value',
//                 }
//             )
        
//         msg.channel.send({embeds: [embed]})
//     }
// })
