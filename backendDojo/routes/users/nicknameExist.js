const express = require('express'),
  router = express.Router(),
  User = require('../../models/User')

router.post('/', async (req, res) => {

  const { nickname } = req.body

  await User.findOne({ nickname }, (err, user) => {
    if (err) {
      return res.status(err.status || 500).json({
        message: err || "Ha habido un error"
      })
    }
    if (user) {
      return res.status(422).json({
        message: "El nickname ingresado ya existe"
      })
    }
    if (!user) {
      return res.send('El nickname esta disponible')
    }
  })
})

module.exports = router