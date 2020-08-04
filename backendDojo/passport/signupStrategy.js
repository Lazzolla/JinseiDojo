const Strategy = require('passport-local').Strategy,
    User = require('../models/User'),
    Instructor = require('../models/Instructor'),
    bcrypt = require('bcryptjs'),
    validationUserDataEmail = require('../mailer/templates/DataValidation')


const SignupStrategy = new Strategy(
    {
        passReqToCallback: true,
        usernameField: 'nickname'
    }, async (req, username, password, done) => {
        const {
            name,
            lastName,
            mail,
            age,
            birthDate,
            dojo,
            instructor,
            isInstructor,
            initialDate,
            rank
        } = req.body



        const encryptedPassword = bcrypt.hashSync(password, 10)
        const securityCode = bcrypt.hashSync((Math.random()).toString(), 10)
        let newUser = new User({
            nickname: username,
            name,
            lastName,
            mail,
            password: encryptedPassword,
            age,
            birthDate,
            dojo,
            instructor,
            isInstructor,
            initialDate,
            rank,
            securityCode
        })
        newUser.save(async (err, user) => {
            if (err) {
                return done(err, null)
            }
            if (user) {
                if (instructor !== "No aparece en la lista") {
                    await Instructor
                        .find({ listName: instructor })
                        .populate('userId', 'mail')
                        .exec((err, inst) => {
                            if (err) {
                                return done(err, null)
                            }
                            if (inst) {
                                validationUserDataEmail(user, inst[0].userId.mail)
                            }
                        })
                } else {
                    validationUserDataEmail(user, 'jinseidojolaplata@gmail.com')
                }
                if (isInstructor) {
                    newInstructor = Instructor({
                        userId: user.id,
                        listName: user.name + " " + user.lastName
                    })
                    await newInstructor.save((err, instructor) => {
                        if (err) {
                            return done(err, null)
                        }
                        if (instructor) {
                            return done(null, user)
                        }
                    })
                } else {
                    return done(null, user)
                }
            }
        })
    })

module.exports = SignupStrategy