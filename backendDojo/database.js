const mongoose = require('mongoose'),
config = require('./config/mongo')

const URI = config.MONGODB_URI 
            ? config.MONGODB_URI
            : 'mongodb://localhost/dojo'

const con = config.MONGODB_URI
                    ? 'in atlas'
                    : 'locally'

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log(`DB is connected ${con}`)
})