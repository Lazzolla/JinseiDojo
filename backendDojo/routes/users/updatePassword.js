const express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../../passport/ensureAuth'),
  User = require('../../models/User'),
  bcrypt = require('bcryptjs'),
  { checkGralValidation } = require('../../middlewares/validation/checkGralValidation')

router.post('/', ensureAuthenticated, checkGralValidation, async (req, res) => {
  const userId = req.user.id,
    password = req.body.password,
    newPassword = req.body.newPassword,
    encryptedNewPassword = bcrypt.hashSync(newPassword, 10)

  await User.findById({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(err.status || 500).json({
        message: "No se encontro el usuario"
      })
    }
    if (user) {
      const isPasswordValid = bcrypt.compareSync(password, user.password)
      if (isPasswordValid) {
        user.password = encryptedNewPassword
        user.save((err, user) => {
          if (err) {
            return res.status(err.status || 500).json({
              message: "No pudimos actualizar la clave"
            })
          }
          if (user) {
            user.password = undefined
            user.isAuthenticated = true
            return res.json({ message: 'La clave se ha actualizado con exito' })
          }
        })
      } else {
        return res.status(401).json({
          message: "La clave original es incorrecta"
        })
      }
    }
  })
})



module.exports = router