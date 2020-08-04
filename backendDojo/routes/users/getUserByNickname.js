const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    User = require('../../models/User'),
    Instructor = require('../../models/Instructor'),
    ensureAuthenticated = require('../../passport/ensureAuth')



router.get('/:nickname', ensureAuthenticated, async (req, res) => {

    await User.findOne({ nickname: req.params.nickname }, async (err, user) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (user) {
            if (user.instructor === "No aparece en la lista") {
                const partialUser = {
                    nickname: user.nickname,
                    name: user.name,
                    lastName: user.lastName,
                    rank: user.rank,
                    dojo: user.dojo,
                    instructor: user.instructor,
                    profilePictureLocation: user.profilePictureLocation,
                    aboutMe: user.aboutMe
                }
                return res.json(partialUser)
            } else {
                await Instructor
                    .findOne({ listName: user.instructor })
                    .populate('userId', 'id')
                    .exec((err, instructor) => {
                        if (err) {
                            return res.status(500).json({
                                message: err || "Ooops, paso algo malo"
                            })
                        }
                        if (instructor.userId.id === req.user.id) {
                            user.passworsd = undefined
                            user.isAuthenticated = true
                            return res.json(user)
                        } else {
                            const partialUser = {
                                nickname: user.nickname,
                                name: user.name,
                                lastName: user.lastName,
                                rank: user.rank,
                                dojo: user.dojo,
                                instructor: user.instructor,
                                profilePictureLocation: user.profilePictureLocation,
                                aboutMe: user.aboutMe
                            }
                            return res.json(partialUser)
                        }
                    })
            }
        }
    })

})

module.exports = router