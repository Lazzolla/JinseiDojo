const express = require('express'),
  router = express.Router(),
  {removeUser} = require('../../chat/users')


router.get('/', async (req, res) => {
    removeUser(req.user.id)
    await req.logOut()
    req.session = null
    req.sessionOptions.maxAge = 0
    return res.status(200).json('Sesión terminada con exito')
  })


  module.exports = router