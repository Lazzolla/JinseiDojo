const express = require('express'),
  router = express.Router(),
  Instructor = require('../../models/Instructor'),
  config = require('../../config/config'),
  { validateSuperAdmin } = require('../../middlewares/validation/validateCredentials')

router.post('/', validateSuperAdmin, async (req, res) => {

  const { userId, listName, validated } = req.body
  const newInstructor = new Instructor({
    userId,
    listName,
    validated
  })
  await newInstructor.save((err, instructor) => {
    if (err) {
      return res.status(500).json({
        message: err || "Ooops, something happened"
      })
    }
    if (instructor) {
      return res.send('Instructor guardado correctamente')
    }
  })
})

module.exports = router