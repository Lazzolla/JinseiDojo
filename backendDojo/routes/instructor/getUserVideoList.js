const express = require('express'),
    router = express.Router(),
    ensureAuthenticated = require('../../passport/ensureAuth'),
    InstructorVideos = require('../../models/InstructorVideos'),
    Instructor = require('../../models/Instructor'),
    { checkGralValidation } = require('../../middlewares/validation/checkGralValidation')

router.get('/', ensureAuthenticated, checkGralValidation, async (req, res) => {

    await Instructor.findOne({ listName: req.user.instructor }, async (err, instructor) => {
        if (err) {
            return res.status(500).json({ message: err })
        }
        if (instructor) {
            await InstructorVideos.find({ userId: instructor.userId }, (err, data) => {
                if (err) {
                    res.status(500).json({ message: err })
                }
                if (data.length > 0) {
                    res.send(data[0].videos)
                } else {
                    res.status(404).json({ message: "Aun no hay videos de tu instructor, intentalo de nuevo en unos dias." })
                }
            })
        }
        if(!instructor) {
            res.status(404).json({ message: "Aun no hay videos de tu instructor, intentalo de nuevo en unos dias." })
        }
    })

})

module.exports = router