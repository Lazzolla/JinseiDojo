const express = require('express');
const router = express.Router()


router.use('/getprograms', require('./getPrograms'))
router.use('/getuserprograms', require('./getUserPrograms'))
    .use('/uploadprogram', require('./uploadProgram'))
    .use('/deleteprogram', require('./deleteProgram'))
    .use('/userprogram', require('./userProgram'))




module.exports = router
