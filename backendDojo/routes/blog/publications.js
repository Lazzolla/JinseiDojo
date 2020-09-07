const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials'),
    UserPublish = require('../../models/UserPublish')

router.get('/', ensureAuthenticated, async (req, res) => {
     const author = req.user.id

    await UserPublish.find({ author }, (err, publications) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (publications) {
            return res.json(publications)
        }
    })
})

module.exports = router