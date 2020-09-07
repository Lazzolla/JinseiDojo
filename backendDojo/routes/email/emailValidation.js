const express = require('express'),
  router = express.Router(),
  User = require('../../models/User'),
  codeGenerator = require('../../helpers/emailValidationCode'),
  EmailValidation = require('../../mailer/templates/EmailValidation')



router.post('/', async (req, res) => {

  const { name, lastName, mail } = req.body,
    userData = {
      name,
      lastName,
      mail
    }

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  if (validateEmail(mail)) {

    await User.findOne({ mail }, (err, user) => {
      if (err) {
        return res.status(err.status || 500).json({
          message: err || "Ha habido un error"
        })
      }
      if (user) {
        return res.status(422).json({
          message: "El correo ingresado ya existe"
        })
      } else {
        codeGenerator.validationCode()
        EmailValidation(userData, codeGenerator.getCode())
        return res.status(200).json("Correo de validación enviado")
      }
    })
  } else {
    return res.status(422).json({
      message: "El correo ingresado no es valido"
    })
  }
})

module.exports = router