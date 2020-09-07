const express = require('express'),
    router = express.Router(),
    Notification = require('../../models/Notifications'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials')

router.put('/', ensureAuthenticated, async (req, res) => {
    await Notification
        .updateOne({ userId: req.user.id }, { $pull: { 'notifications': { 'fromUser': req.body.userNotiId } } })
        .exec(async (err, response) => {
            if (err) {
                return res.status(500).json({
                    message: err || "Ooops, paso algo malo"
                })
            }
            if (response) {
                res.status(200).json('Notificaciónes borradas')
            }
        })
})

module.exports = router