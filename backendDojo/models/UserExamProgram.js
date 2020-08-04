const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserExamProgramSchema = new Schema({ 
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        title: String,
        techniques:[
             {
               name: String,
               value: String,
               index: Number
              
        }
    ],
        fullDate: {type: Date, default: new Date()}
})

const UserExamProgram = mongoose.model('UserExamProgram', UserExamProgramSchema)

module.exports = UserExamProgram