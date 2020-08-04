const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram'),
  ensureAuthenticated = require('../../passport/ensureAuth')


router.get('/', ensureAuthenticated, async (req, res) => {

           await ExamProgram.find((err, programs) => {
            if (err) {
                return res.status(500).json({
                  message: err || "Ooops, something happened"
                })
              }
              if(programs) {
                  return res.send(programs)
              }
           })
  })

  module.exports = router