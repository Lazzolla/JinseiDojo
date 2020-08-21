const express = require('express'),
  router = express.Router(),
  User = require('../../models/User'),
  Instructor = require('../../models/Instructor'),
  { getUser } = require('../../chat/users')


//Confirmation of user data with secretCode from Signup Strategy
router.post('/', async (req, res) => {
  let io = req.app.get('socketio')

  const { instructor, dojo, rank, isInstructor, id, rankLevel, name, lastName, practiceDojo } = req.body
  // Converting stringBooleans in real Booleans
  const instructorBoolean = (instructor == "true"),
    dojoBoolean = (dojo == "true"),
    rankBoolean = (rank == "true")

  if (isInstructor === "true" || isInstructor === undefined) {
    if (instructorBoolean && dojoBoolean && rankBoolean) {
      User.findOneAndUpdate(
        { _id: id },
        { dataValidation: true },
        async (err, user) => {
          if (err) {
            res.status(500).json('Algo salio mal!.')
          }
          if (!user) {
            res.status(404).json(`<script>window.alert('No pudimos encontrar ningun usuario en la base de datos. Por favor contactese con Santiago Laza a la brevedad.'), window.close()</script>`)
          }
          if (user) {
            if (isInstructor === "true") {
              await Instructor.findOneAndUpdate({ userId: id }, { validated: true }, { new: true }, (err, instructor) => {
                if (err) {
                  res.status(500).json('Algo salio mal!.')
                }
                if (instructor) {
                  res.send(`<script>window.alert('La validacion de ${name} ${lastName} fue exitosa'), window.close()</script>`)
                  const { socketId } = getUser(user.nickname)
                  io.to(socketId).emit('updateValidation', 'done')
                }
              })
            } else {
              res.send(`<script>window.alert('La validacion de ${name} ${lastName} fue exitosa'), window.close()</script>`)
              const { socketId } = getUser(user.nickname)
              io.to(socketId).emit('updateValidation', 'done')
            }
          }
        })
    } else {
      switch ((instructorBoolean || dojoBoolean || rankBoolean) == false) {
        case instructorBoolean: res.send(`<script>window.alert("Usted indico que no es el instructor de ${name} ${lastName}, sin embargo el indico que si lo es. Si usted se confundio al validar los datos puede hacerlo de nuevo utilizando el mismo formulario en su correo. De lo contrario ${name} ${lastName} quedara restringido hasta que se resuelva la discrepancia"),
          window.close()</script>`)
          break
        case dojoBoolean: res.send(`<script>window.alert("Usted indico que ${name} ${lastName} no practica en ${practiceDojo}, sin embargo el indico que si lo hace. Si usted se confundio al validar los datos puede hacerlo de nuevo utilizando el mismo formulario en su correo. De lo contrario ${name} ${lastName} quedara restringido hasta que se resuelva la discrepancia"),
          window.close()</script>`)
          break
        case rankBoolean: res.send(`<script>window.alert("Usted indico que ${name} ${lastName} no es ${rankLevel}, sin embargo el indico que si lo es. Si usted se confundio al validar los datos puede hacerlo de nuevo utilizando el mismo formulario en su correo. De lo contrario ${name} ${lastName} quedara restringido hasta que se resuelva la discrepancia"),
          window.close()</script>`)
          break
        default: res.send(`<script>window.alert("Usted indico que mas de uno de los datos no son ciertos. Si usted se confundio al validar los datos puede hacerlo de nuevo utilizando el mismo formulario en su correo. De lo contrario ${name} ${lastName} quedara restringido hasta que se resuelva la discrepancia"),
          window.close()</script>`)
          break
      }
    }
  } else {
    if (isInstructor === "false") {
      res.send(`<script>window.alert("Usted indico que ${name} ${lastName} no es instructor, sin embargo el indico que si lo es. Si usted se confundio al validar los datos puede hacerlo de nuevo utilizando el mismo formulario en su correo. De lo contrario ${name} ${lastName} quedara restringido hasta que se resuelva la discrepancia"),
      window.close()</script>`
      )
    }
  }
})

module.exports = router