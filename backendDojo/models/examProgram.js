const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ExamProgramSchema = new Schema({ 
        title: String,
        subTitle: String,
        techniques: [
            {
                attack: String,
                technique: String
            }
        ],
        fullDate: {type: Date, default: new Date()}
})

const ExamProgram = mongoose.model('ExamProgram', ExamProgramSchema, 'examPrograms')

module.exports = ExamProgram