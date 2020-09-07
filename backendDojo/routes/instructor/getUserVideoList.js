const express = require('express'),
    router = express.Router(),
    InstructorVideos = require('../../models/InstructorVideos'),
    Instructor = require('../../models/Instructor'),
    { ensureAuthenticated, checkGralValidation } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, checkGralValidation, async (req, res) => {

    await Instructor.findOne({ listName: req.user.instructor }, async (err, instructor) => {
        if (err) {
            return res.status(500).json({ message: err })
        }
        if (instructor) {
            await InstructorVideos.find({ userId: instructor.userId }, (err, data) => {
                if (err) {
                    return res.status(500).json({ message: err })
                }
                if (data.length > 0) {
                    return res.send(data[0].videos)
                } else {
                    return res.status(404).json({ message: "Aun no hay videos de tu instructor, intentalo de nuevo en unos dias." })
                }
            })
        }
        if (!instructor) {
            return res.status(404).json({ message: "Aun no hay videos de tu instructor, intentalo de nuevo en unos dias." })
        }
    })
})

module.exports = router