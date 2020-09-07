const express = require('express'),
    router = express.Router()

router.use('/getprograms', require('./getPrograms'))
    .use('/getuserprograms', require('./getUserPrograms'))
    .use('/uploadprogram', require('./uploadProgram'))
    .use('/deleteprogram', require('./deleteProgram'))
    .use('/userprogram', require('./userProgram'))

module.exports = router
