const express = require('express'),
  router = express.Router(),
  codeGenerator = require('../../helpers/emailValidationCode')

router.post('/', (req, res) => {
    const { validationCode } = req.body
    if (validationCode == codeGenerator.getCode()) {
      const validated = true
      return res.json({ validated })
    } else {
      return res.status(401).json({ message: 'El codigo ingresado es incorrecto' })
    }
  })

  module.exports = router