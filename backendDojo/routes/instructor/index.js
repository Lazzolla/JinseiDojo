const express = require('express')
const router = express.Router()


router.use('/getvideoslist', require('./getVideosList'))
.use('/getuservideolist', require('./getUserVideoList'))
      .use('/savevideoslist', require('./saveVideosList'))
      .use('/addinstructor', require('./addInstructor'))
      .use('/getlistinstructors', require('./getListInstructors'))

module.exports = router