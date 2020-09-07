const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    chatMessageSchema = new Schema({

        message: String,
        nickname: String,
        created_at: String,
        systemDate: { type: String, default: null },
        fullDate: Date
    })

const chatGralRoom = mongoose.model('chatGralRoom', chatMessageSchema, 'gralRoom')

module.exports = chatGralRoom