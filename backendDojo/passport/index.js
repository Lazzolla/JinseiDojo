const passport = require('passport'),
      User = require('../models/User')

      passport.serializeUser(function (user, done) {
        done(null, user._id)
    })

      passport.deserializeUser(function (_id, done) {
        User.findOne({_id}).exec((err, user) => {
                done(err, user)
        })
})
// Import all Strategies
const SignupStrategy = require('./signupStrategy')
const LoginStrategy = require('./loginStrategy')

passport.use('local-signup', SignupStrategy)
passport.use('local-login', LoginStrategy)

module.exports = passport