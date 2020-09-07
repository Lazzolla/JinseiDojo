const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials'),
    UserPublish = require('../../models/UserPublish')

router.delete('/', ensureAuthenticated,  (req, res) => {

    UserPublish.findOneAndUpdate({ _id: req.query.publicationId }, { $pull: { comments: {_id: req.query.commentId} } }, (err, comment) => {
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