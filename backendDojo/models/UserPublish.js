const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserPublishSchema = new Schema({
        
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        title: String,
        body: String,
        created_at: Number,
        comments: [
           {
                commentAuthor: {type: Schema.Types.ObjectId, ref: 'User'},
                message: String
            }
        ]
    })

const UserPublish = mongoose.model('UserPublish', UserPublishSchema)

module.exports = UserPublish