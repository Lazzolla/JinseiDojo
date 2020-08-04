const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ProfilePictureSchema = new Schema({
        
        userId: String,
        filename: String,
        path: String,
        originalname: String,
        mimetype: String,
        size: Number,
        created_at: { type: Date, default: Date.now() }
    })

const ProfilePicture = mongoose.model('ProfilePicture', ProfilePictureSchema)

module.exports = ProfilePicture