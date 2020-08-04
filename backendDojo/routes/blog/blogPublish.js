const express = require('express'),
    router = express.Router(),
    ensureAuthenticated = require('../../passport/ensureAuth'),
    UserPublish = require('../../models/UserPublish')

router.post('/', ensureAuthenticated, async (req, res) => {
    const { title, publication, created_at } = req.body
    const { _id } = req.user
    const newPublication = new UserPublish({
        author: _id,
        title,
        body: publication,
        created_at
    })
    await newPublication.save((err, publication) => {
        if (err) {
            return res.status(500).json({
                message: err || "Ooops, paso algo malo"
            })
        }
        if (publication) {
            return res.json('Publicated')
        }
    })
})

module.exports = router