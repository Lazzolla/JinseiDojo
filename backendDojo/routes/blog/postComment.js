const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials'),
    UserPublish = require('../../models/UserPublish')

router.post('/', ensureAuthenticated,  (req, res) => {

    const comment = {
        commentAuthor: req.user._id,
        message: req.body.comment
    }
// CANT USE ASYNC AWAIT FOR DUPLICATIONS IN DB I DONT KNOW WHY
    UserPublish.findOneAndUpdate({ _id: req.body.publicationId }, { $push: {comments: comment} }, (err, comment) => {
        if (err) {
            return res.status(500).json({
                message: "No se encontro la publicación que quisiste borrar"
            })
        }
        if (comment) {
            return res.json(comment)
        }
    })
})

module.exports = router