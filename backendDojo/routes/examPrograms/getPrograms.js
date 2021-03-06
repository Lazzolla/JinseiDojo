const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram'),
  { ensureAuthenticated, checkGralValidation } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, checkGralValidation, async (req, res) => {

  await ExamProgram.find((err, programs) => {
    if (err) {
      return res.status(500).json({
        message: err || "Ooops, something happened"
      })
    }
    if (programs) {
      return res.send(programs)
    }
  })
})

module.exports = router