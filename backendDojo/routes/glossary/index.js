const express = require('express'),
      router = express.Router()

router.use('/getglossary', require('./getGlossary'))
      .use('/removeentry', require('./removeEntry'))
      .use('/postentry', require('./postEntry'))
      .use('/postmanyentries', require('./postManyEntries'))

module.exports = router