const express = require('express'),
  router = express.Router(),
  {removeUser} = require('../../chat/users')


router.post('/', (req, res) => {
  
  removeUser(req.body.userId)
    req.logOut()
    req.session = null
    req.sessionOptions.maxAge = 0
    return res.status(200).json('Sesión terminada con exito')
  })


  module.exports = router