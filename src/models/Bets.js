const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    gameId: {
        type: Number,
        required: true,
        default: 0
    },
    betAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    possiblePayout: {
        type: Number,
        required: true,
        default: 0,
    },
    betTeam: {
        type: String,
        required: true,
    }
})

module.exports = model('Bets', userSchema)