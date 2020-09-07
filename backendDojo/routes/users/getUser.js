const express = require('express'),
    router = express.Router(),
    User = require('../../models/User'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, async (req, res) => {

    await User.findById({ _id: req.user.id }, (err, user) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (user) {
            user.passworsd = undefined
            user.isAuthenticated = true
            return res.json(user)
        }
    })
})

module.exports = router