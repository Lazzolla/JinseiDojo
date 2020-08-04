const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram')



router.post('/', async (req, res) => {
        const password = req.body.password
        const superAdminKey = "%*k7-2t.N{?MS3}zTmx:-^-8Hh(c`9N<]}p4$vW?,'`-`W`S9cJ?B04OD[WtHHq"
        if(password === superAdminKey) {
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