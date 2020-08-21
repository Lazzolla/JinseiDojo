const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram'),
  config = require('../../config/config')



router.post('/', async (req, res) => {
        const password = req.body.password
        if(password === config.SUPER_ADMIN_KEY) {
            const {title, subTitle, techniques} = req.body
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
              if(program) {
                  return res.send('Programa guardado correctamente')
              }
           })
        } else {
            res.status(401).json({message: "Necesitas enviar la clave para modificar o agregar programas"})
        }
  })

  module.exports = router