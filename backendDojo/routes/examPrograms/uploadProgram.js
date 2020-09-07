const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram'),
  { validateSuperAdmin } = require('../../middlewares/validation/validateCredentials')

router.post('/', validateSuperAdmin, async (req, res) => {

  const { title, subTitle, techniques } = req.body
  const newExamProgram = new ExamProgram({
    title,
    subTitle,
    techniques
  })
  await newExamProgram.save((err, program) => {
    if (err) {
      return res.status(500).json({
        message: err || "Ooops, something happened"
      })
    }
    if (program) {
      return res.send('Programa guardado correctamente')
    }
  })
})

module.exports = router