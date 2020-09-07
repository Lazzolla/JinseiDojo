const express = require('express'),
    router = express.Router(),
    User = require('../../models/User'),
    Notification = require('../../models/Notifications'),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials')

router.get('/', ensureAuthenticated, async (req, res) => {

    await Notification
        .findOne({ userId: req.user.id })
        .populate('notifications.fromUser', 'profilePictureLocation nickname')
        .exec(async (err, response) => {
            if (err) {
                return res.status(500).json({
                    message: err || "Ooops, paso algo malo"
                })
            }
            if (response) {
                const fromUsers = response.notifications.reduce((prevUser, user) => {
                    prevUser[user.fromUser.id] = (prevUser[user.fromUser.id] || 0) + 1
                    return prevUser
                }, {})
                const ArrayFromUsers = Object.keys(fromUsers).map(async key => {
                    const user = {
                        userPopulate: await User
                            .find({ _id: key })
                            .select({ 'nickname': 1, 'profilePictureLocation': 1 })
                            .exec(),
                        id: key,
                        count: fromUsers[key]
                    }
                    return user
                })
                const data = await Promise.all(ArrayFromUsers)
                res.json(data)
            }
            if (!response) {
                res.json([])
            }
        })
})

module.exports = router