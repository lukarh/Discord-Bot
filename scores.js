const getJSON = require('../../utils/getJSON')

const teamEmojis = require(`../../assets/teams/emojis.json`)
const teamColors = require(`../../assets/teams/colors.json`)
const teamNicknames = require(`../../assets/teams/nicknames.json`)
const broadcastEmojis = require(`../../assets/broadcast-emojis.json`)


const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'show-scores',
    description: 'Shows the either the score for current NBA Games or upcoming NBA games.',
    devOnly: false,

    callback: (client, interaction) => {
        const currentDateStamp = new Date()
        // const day = currentDateStamp.getDate();
        // const month = currentDateStamp.getMonth() + 1; // Months are zero-based, so adding 1
        // const year = currentDateStamp.getFullYear();
        // const todayDate = `${month}/${day}/${year}`

        // Format the date with a preceding 0 for single-digit month or day
        // const options = { 
        //     day: '2-digit',
        //     month: '2-digit',
        //     year: 'numeric'
        // };
        // const todayDate = currentDateStamp.toLocaleString('en-US', options);
        // console.log(todayDate)

        // json = await getJSON(`https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json`)
        // console.log('here1')

        // const gameObjects = json.leagueSchedule.gameDates
        // console.log('here2')
n
        // for (const gameObject of gameObjects) {
        //     let gameDate = gameObject.gameDate
        //     gameDate = gameDate.replace(' 00:00:00','')

        //     // if ()
        //     const games = gameObject.games
        //     //console.log(gameObject.gameDate)
        //     //console.log(gameObject.games)
        //     console.log(gameDate, todayDate, currentDate)
        //     // if 
        // }

        // const scoresEmbed = new EmbedBuilder()
        //     .setTitle(`${teamEmojis.NBA} Today's NBA Games`)
        //     .setDescription("This is an embed")
        //     .setColor(`${teamColors.NBA}`) // 0x[hexcode]
        //     .addFields(
        //         { 
        //             name: 'Field title', 
        //             value: 'Some random value',
        //             inline: true,
        //         },
        //         { 
        //             name: '2nd Field title', 
        //             value: 'Some random value',
        //             inline: true,
        //         }
        //     )
        //     .addFields(
        //         { 
        //             name: 'Field title', 
        //             value: 'Some random value',
        //         },
        //         { 
        //             name: '2nd Field title', 
        //             value: 'Some random value',
        //         }
        //     )

        // interaction.reply({ embeds: [scoresEmbed] });
        interaction.reply('hi')
    },
}