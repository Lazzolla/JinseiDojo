const express = require('express'),
  router = express.Router(),
  InstructorVideos = require('../../models/InstructorVideos'),
  { ensureAuthenticated, checkGralValidation, validateInstructor } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, checkGralValidation, validateInstructor, async (req, res) => {

        await InstructorVideos.find({userId: req.user.id}, (err, data) => {
            if(err) {
                res.status(500).json({message: err})
            }
            if(data.length > 0) {
                res.send(data[0].videos) 
            } else {
                res.status(404).json({message: "Aun no existen videos salvados"})
            }
        })

})

module.exports = router