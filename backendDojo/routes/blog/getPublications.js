const express = require('express'),
    router = express.Router(),
    UserPublish = require('../../models/UserPublish'),
  ensureAuthenticated = require('../../passport/ensureAuth')

router.get('/', ensureAuthenticated, async (req, res) => {

        await UserPublish.find()
        .populate('author', 'nickname profilePictureLocation')
        .populate('comments.commentAuthor', {'nickname': 1, 'profilePictureLocation': 1})
        .exec( (err, publications) => {
            if (err) {
                return res.status(500).json({
                    message: err || "Ooops, paso algo malo"
                })
            }
            if (publications) {
                res.json(publications)              
            }
        })
})

module.exports = router