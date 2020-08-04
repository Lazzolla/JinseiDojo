const mongoose = require('mongoose'),
    Schema = mongoose.Schema



function toLower(value) {
    return value.toLowerCase()
}

const UserSchema = new Schema({
    nickname: String,
    name: String,
    lastName: String,
    mail: { type: String, set: toLower },
    password: String,
    birthDate: String, 
    dojo: String,
    instructor: String,
    isInstructor: Boolean, 
    initialDate: String, 
    rank: String,
    aboutMe: { type: String, default: "Escribe algo sobre tí (500 caracteres max)" },
    cellphone: String,
    dataValidation: { type: Boolean, default: false },
    securityCode: String,
    isAuthenticated: { type: Boolean, default: false },
    boardManagement: { type: Boolean, default: false },
    profilePictureLocation: { type: String, default: 'https://profilepicturesbucket.s3-sa-east-1.amazonaws.com/defaultProfilePicture.png' },
    profilePictureName: { type: String, default: 'defaultProfilePicture.png' },
    publication: [{ type: Schema.Types.ObjectId, ref: 'UserPublish' }],
    UserExamPrograms: [{ type: Schema.Types.ObjectId, ref: 'UserExamProgram' }],
    instructorVideos: [{ type: Schema.Types.ObjectId, ref: 'InstructorVideos' }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'privateChatMessage' }]
},
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    })

UserSchema.virtual('age').get(
    function () {
        let today = new Date()
        let birthDate = new Date(this.birthDate)
        let age = today.getFullYear() - birthDate.getFullYear()
        let m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    })


const User = mongoose.model('User', UserSchema)

module.exports = User