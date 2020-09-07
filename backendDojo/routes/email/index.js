const express = require('express'),
    router = express.Router()

router.use('/confirmuser', require('./confirmUser'))
    .use('/confirmemail', require('./emailResponseValidation'))
    .use('/emailexist', require('./emailValidation'))

module.exports = router
