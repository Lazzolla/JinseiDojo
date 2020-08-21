const express = require('express'),
  router = express.Router(),
  ExamProgram = require('../../models/examProgram'),
  config = require('../../config/config')



router.delete('/', async (req, res) => {
        const password = req.body.password
        if(password === config.SUPER_ADMIN_KEY) {
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