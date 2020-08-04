const express = require('express'),
  router = express.Router(),
  passport = require('../../passport')

router.post('/', (req, res, next) => {

    passport.authenticate('local-signup', async function (err, user, info) {
      if (err) {
        return res.status(500).json({
          message: err || "Ooops, paso algo malo"
        })
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({
            message: err || "Ooops, paso algo malo"
          })
        }
        user.password = undefined
        user.isAuthenticated = true
        return res.json(user)
      })
    })(req, res, next)
  })

  module.exports = router