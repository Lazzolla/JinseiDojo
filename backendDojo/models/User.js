const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    emailValidator = require('email-validator')

const UserSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    mail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    birthDate: {
        type: String,
        required: true
    },
    dojo: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    isInstructor: {
        type: Boolean,
        required: true
    },
    initialDate: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    aboutMe: {
        type: String,
        default: "Escribe algo sobre tí (500 caracteres max)"
    },
    cellphone: {
        type: String,
        default: "xxxxxxxxxxx"
    },
    dataValidation: {
        type: Boolean,
        default: false
    },
    securityCode: String,
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    boardManagement: {
        type: Boolean,
        default: false
    },
    profilePictureLocation: {
        type: String,
        default: 'https://profilepicturesbucket.s3-sa-east-1.amazonaws.com/defaultProfilePicture.png'
    },
    profilePictureName: {
        type: String,
        default: 'defaultProfilePicture.png'
    },
    publication: [
        {
            type: Schema.Types.ObjectId,
            ref: 'UserPublish'
        }
    ],
    UserExamPrograms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'UserExamProgram'
        }
    ],
    instructorVideos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'InstructorVideos'
        }
    ],
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'privateChatMessage'
        }
    ]
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