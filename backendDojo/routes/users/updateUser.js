const express = require('express'),
  router = express.Router(),
  ensureAuthenticated = require('../../passport/ensureAuth'),
  User = require('../../models/User'),
  Instructor = require('../../models/Instructor'),
  validationUserDataEmail = require('../../mailer/templates/DataValidation')

router.put('/', ensureAuthenticated, async (req, res) => {
  const {
    nickname,
    name,
    lastName,
    mail,
    birthDate,
    initialDate,
    dojo,
    instructor,
    rank,
    aboutMe,
    cellphone,
    dataValidation,
    needValidation
  } = req.body
  let updateFields
  if (dataValidation !== null) {
    updateFields = {
      nickname,
      name,
      lastName,
      mail,
      birthDate,
      initialDate,
      dojo,
      instructor,
      rank,
      aboutMe,
      cellphone,
      dataValidation
    }
  } else {
    updateFields = {
      nickname,
      name,
      lastName,
      mail,
      birthDate,
      initialDate,
      dojo,
      instructor,
      rank,
      aboutMe,
      cellphone
    }
  }
  User.findOneAndUpdate({ _id: req.user.id },
    updateFields, { new: true }, async (err, user) => {
      if (err) {
        return res.status(err.status || 500).json({
          message: err || "Algo salio mal"
        })
      }
      if (user) {
        if (needValidation) {
          if (instructor !== "No aparece en la lista") {
            await Instructor
              .find({ listName: instructor })
              .populate('userId', 'mail')
              .exec((err, instructor) => {
                if (err) {
                  return res.status(err.status || 500).json({
                    message: err || "Algo salio mal"
                  })
                }
                if (instructor) {
                  validationUserDataEmail(user, instructor[0].userId.mail)
                  user.isAuthenticated = true
                  return res.status(200).json(user)
                }
              })
          } else {
            validationUserDataEmail(user, 'jinseidojolaplata@gmail.com')
          }
        } else {
          user.isAuthenticated = true
          return res.status(200).json(user)
        }

      }
    })
})

module.exports = router