const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram')



router.delete('/', async (req, res) => {
        const password = req.body.password
        const superAdminKey = "ClaveParaModificarComoSuperAdmin2%*k7-2t.N{?MS3}zTmx:-^-8Hh(c`9N<]}p4$vW?,'`-`W`S9cJ?B04OD[WtHHq41001"
        if(password === superAdminKey) {
            const {title} = req.body
           await ExamProgram.findOneAndDelete({title}, (err, program) => {
             
            if (err) {
                return res.status(500).json({
                  message: err || "Ooops, something happened"
                })
              }
              if(program) {
                  return res.send('Programa eliminado correctamente')
              }
           })
        } else {
            res.status(401).json({message: "Necesitas enviar la clave para eliminar o agregar programas"})
        }
  })

  module.exports = router