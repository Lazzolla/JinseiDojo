const express = require('express');
const router = express.Router()


router.use('/adddojo', require('./addDojo'))
    .use('/getdojos', require('./getDojos'))
    .use('/removedojo', require('./removeDojo'))



module.exports = router
