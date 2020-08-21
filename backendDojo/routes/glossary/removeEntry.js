const users = require('../../chat/users')

const express = require('express'),
    router = express.Router(),
    GlossaryEntry = require('../../models/GlossaryEntry'),
    config = require('../../config/config')



router.delete('/', async (req, res) => {

    const password = req.body.password

    if (password === config.SUPER_ADMIN_KEY) {

           await GlossaryEntry
           .findOneAndUpdate({_id: req.body.id}, {$pull: {entries: { title: req.body.title}}}, {new:true}, (err, entry) => {
            if(err) {
                res.status(500).json({message: err})
            }
            if(entry) {
                res.send(entry)
            }
            })
    }
})

module.exports = router