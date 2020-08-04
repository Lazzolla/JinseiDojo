const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    GlossaryEntrySchema = new Schema({
       entries: [
            {
                title: String,
                description: String,
                category: String,
                fullDate: { type: Date, default: new Date() }
            }
        ]
    })

const GlossaryEntry = mongoose.model('GlossaryEntry', GlossaryEntrySchema)

module.exports = GlossaryEntry