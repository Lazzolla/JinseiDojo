const express = require('express'),
    router = express.Router(),
    User = require('../../models/User'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, async (req, res) => {

    await User.find()
        .select({ 'nickname': 1, 'profilePictureLocation': 1 })
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    message: err || "Ooops, paso algo malo"
                })
            }
            if (users) {
                return res.json(users)
            }
        })
})

module.exports = router