const express = require('express'),
  router = express.Router(),
  passport = require('../../passport')

router.post('/', function (req, res, next) {
    passport.authenticate('local-login', async function (err, user, info) {
      if (err) {
        return res.status(500).json({
          message: err|| "Ooops, something happened"
        })
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({
            message: err || "Ooops, something happened"
          })
        }
        user.password = undefined
        user.isAuthenticated = true
        return res.json(user)
      })
    })(req, res, next)
  })

  module.exports = router