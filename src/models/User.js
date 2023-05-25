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
    balance: {
        type: Number,
        default: 0,
    },
    signupDate: {
        type: Date,
        required: true,
    },
    lastDaily: {
        type: Date,
        required: false,
    },
    wins: {
        type: Number,
        default: 0,
        required: false,
    }, 
    loss: {
        type: Number,
        default: 0,
        required: false,
    },
    careerBuyIn: {
        type: Number,
        default: 0,
        required: false,
    },
    careerPayout: {
        type: Number,
        default: 0,
        required: false,
    }
})

module.exports = model('User', userSchema)