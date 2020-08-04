const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    PrivateChatMessageSchema = new Schema({ 
        userId: String,
        userIdTwo: String,
        messages: [
                    {
        message: String,
        nickname: String,
        created_at: String,
        systemDate: {type: String, default: null},
        receivedNickname: String,
        readed: {type: Boolean, default: false},
        fullDate: {type: Date, default: new Date()}
    }
]
})

const chatPrivateRoom = mongoose.model('chatPrivateRoom', PrivateChatMessageSchema, 'privateRoom')

module.exports = chatPrivateRoom