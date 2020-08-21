const mongoose = require('mongoose'),
        mongoosePaginate = require('mongoose-paginate-v2')
    Schema = mongoose.Schema,
    chatMessageSchema = new Schema({
        
        message: String,
        nickname: String,
        created_at: String,
        systemDate: {type: String, default: null},
        fullDate: Date
    })

    chatMessageSchema.plugin(mongoosePaginate)
    
const chatGralRoom = mongoose.model('chatGralRoom', chatMessageSchema, 'gralRoom')

module.exports = chatGralRoom