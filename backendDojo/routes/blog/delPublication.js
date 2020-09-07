const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated } = require('../../middlewares/validation/validateCredentials'),
    UserPublish = require('../../models/UserPublish')

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const id = req.params.id
    await UserPublish.findByIdAndDelete({ _id: id }, (err, publication) => {
        if (err) {
            return res.status(500).json({
                message: "No se encontro la publicación que quisiste borrar"
            })
        }
        if (publication) {
            return res.json(publication)
        }
    })
})

module.exports = router