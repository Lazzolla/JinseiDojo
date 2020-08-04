const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    InstructorVideosSchema = new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        videos: [
            [
            {
                title: String,
                url: String
            }
        ]
        ],
        fullDate: {type: Date, default: new Date()}
    })

const InstructorVideos = mongoose.model('InstructorVideos', InstructorVideosSchema)

module.exports = InstructorVideos