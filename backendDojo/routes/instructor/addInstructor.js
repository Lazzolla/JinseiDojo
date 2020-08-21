const express = require('express'),
  router = express.Router(),
  Instructor = require('../../models/Instructor'),
  config = require('../../config/config')

router.post('/',  async (req, res) => {
        const password = req.body.password

        if(password === config.SUPER_ADMIN_KEY) {
            const {userId, listName, validated} = req.body
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
              if(instructor) {
                  return res.send('Instructor guardado correctamente')
              }
           })
        } else {
            res.status(401).json({message: "Necesitas enviar la clave para modificar o agregar instructores"})
        }
  })

  module.exports = router