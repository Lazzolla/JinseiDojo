const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DojosSchema = new Schema({ 
        dojoName: String,
})

const Dojos = mongoose.model('Dojos', DojosSchema, 'dojos')

module.exports = Dojos