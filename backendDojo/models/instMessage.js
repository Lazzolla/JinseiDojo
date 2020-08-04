const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    instMessageSchema = new Schema({
        
        message: String,
        nickname: String,
        created_at: String,
        systemDate: {type: String, default: null},
        fullDate: {type: Date, default: new Date()}
    })

const instGralRoom = mongoose.model('instGralRoom', instMessageSchema, 'instRoom')

module.exports = instGralRoom