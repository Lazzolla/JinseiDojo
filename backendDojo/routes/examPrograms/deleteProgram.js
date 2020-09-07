const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram'),
  { validateSuperAdmin } = require('../../middlewares/validation/validateCredentials')

router.delete('/', validateSuperAdmin, async (req, res) => {

    const { title } = req.body
    await ExamProgram.findOneAndDelete({ title }, (err, program) => {

      if (err) {
        return res.status(500).json({
          message: err || "Ooops, something happened"
        })
      }
      if (program) {
        return res.send('Programa eliminado correctamente')
      }
    })
})

module.exports = router