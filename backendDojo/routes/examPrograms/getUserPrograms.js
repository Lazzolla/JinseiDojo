const express = require('express'),
    router = express.Router(),
    UserExamProgram = require('../../models/UserExamProgram'),
    { ensureAuthenticated, checkGralValidation } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, checkGralValidation, async (req, res) => {
    const { id } = req.user
    await UserExamProgram.find({ userId: id }, (err, programs) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, something happened"
            })
        }
        if (programs) {
            return res.send(programs)
        }
    })
})

module.exports = router