const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    InstructorSchema = new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'User'},
        listName: String, //this name will be for students to select from the instructor list
        validated: {type: Boolean, default: false}
    })

const Instructor = mongoose.model('Instructor', InstructorSchema)

module.exports = Instructor