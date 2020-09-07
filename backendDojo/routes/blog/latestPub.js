const express = require('express'),
    router = express.Router(),
    UserPublish = require('../../models/UserPublish')

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        await UserPublish
            .find()
            .sort('-created_at')
            .limit(3)
            .populate('author', 'profilePictureLocation nickname')
            .exec((err, publications) => {
                if (err) {
                    return res.status(500).json({
                        message: err || "Ooops, paso algo malo"
                    })
                }
                if (publications) {
                    res.json(publications)
                }
            })
    } else {
        await UserPublish
            .find({}, { 'author': 1, 'created_at': 1, 'title': 1 })
            .sort('-created_at')
            .limit(3)
            .populate('author', 'profilePictureLocation nickname')
            .exec((err, publications) => {
                if (err) {
                    return res.status(500).json({
                        message: err || "Ooops, paso algo malo"
                    })
                }
                if (publications) {
                    return res.json(publications)
                }
            })
    }
})

module.exports = router