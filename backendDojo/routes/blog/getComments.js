const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials'),
    UserPublish = require('../../models/UserPublish')

router.get('/:id', ensureAuthenticated, async (req, res) => {

    await UserPublish
    .findOne({ _id: req.params.id})
    .populate('comments.commentAuthor', {'nickname': 1, 'profilePictureLocation': 1})
    .exec( (err, comments) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }
        if (comments) {
            return res.json(comments)
        }
    })
})

module.exports = router