const Strategy = require('passport-local').Strategy,
    User = require('../models/User'),
    bcrypt = require('bcryptjs')

const LoginStrategy = new Strategy(
    {
        passReqToCallback: true,
        usernameField: 'mail',
        passwordField: 'password'
    },
   async (req, mail, password, done) => {
      await  User.findOne({ mail }, (err, user) => {
            if(err) {
                return done(err, null)
            }
            if(!user) {
                return done('Los Datos Ingresados son Incorrectos', null)
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if(!isPasswordValid) {
                return done('Los Datos Ingresados son Incorrectos', null)
            }
            return done(null, user)
        })
    })

    module.exports = LoginStrategy